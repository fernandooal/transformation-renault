/** Serialização de tabelas para CSV e XLSX. Sem dependência: o .xlsx é o OOXML mínimo. */

export interface SheetColumn<T> {
  header: string;
  value: (row: T) => string | number;
}

/* ------------------------------------------------------------------ CSV -- */

/** `;` e BOM: é o que o Excel pt-BR precisa para separar colunas e ler acentos. */
const CSV_SEP = ";";

function csvCell(value: string | number): string {
  // Vírgula decimal: sem ela o Excel pt-BR lê "4.5" como texto, não como número.
  const text =
    typeof value === "number" && Number.isFinite(value)
      ? String(value).replace(".", ",")
      : String(value ?? "");
  return /[";\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv<T>(columns: Array<SheetColumn<T>>, rows: T[]): Blob {
  const lines = [
    columns.map((c) => csvCell(c.header)).join(CSV_SEP),
    ...rows.map((row) => columns.map((c) => csvCell(c.value(row))).join(CSV_SEP)),
  ];
  return new Blob([`﻿${lines.join("\r\n")}\r\n`], { type: "text/csv;charset=utf-8" });
}

/* ----------------------------------------------------------------- XLSX -- */

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

const xml = (value: string): string => value.replace(/[&<>"']/g, (ch) => XML_ESCAPES[ch]);

function cellRef(colIndex: number, rowNumber: number): string {
  let n = colIndex + 1;
  let name = "";
  while (n > 0) {
    name = String.fromCharCode(65 + ((n - 1) % 26)) + name;
    n = Math.floor((n - 1) / 26);
  }
  return `${name}${rowNumber}`;
}

/** `inlineStr` dispensa o sharedStrings.xml; datas saem como texto para dispensar o styles.xml. */
function sheetCell(value: string | number, ref: string): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `<c r="${ref}"><v>${value}</v></c>`;
  }
  const text = String(value ?? "");
  if (!text) return `<c r="${ref}"/>`;
  return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xml(text)}</t></is></c>`;
}

function sheetXml<T>(columns: Array<SheetColumn<T>>, rows: T[]): string {
  const header = `<row r="1">${columns
    .map((c, i) => sheetCell(c.header, cellRef(i, 1)))
    .join("")}</row>`;

  const body = rows
    .map((row, r) => {
      const n = r + 2;
      return `<row r="${n}">${columns
        .map((c, i) => sheetCell(c.value(row), cellRef(i, n)))
        .join("")}</row>`;
    })
    .join("");

  const cols = columns
    .map((_, i) => `<col min="${i + 1}" max="${i + 1}" width="22" customWidth="1"/>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols>${cols}</cols><sheetData>${header}${body}</sheetData></worksheet>`;
}

export function toXlsx<T>(
  columns: Array<SheetColumn<T>>,
  rows: T[],
  sheetName = "Planilha1"
): Blob {
  return zip([
    [
      "[Content_Types].xml",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`,
    ],
    [
      "_rels/.rels",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    ],
    [
      "xl/workbook.xml",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${xml(
        sheetName.slice(0, 31)
      )}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    ],
    [
      "xl/_rels/workbook.xml.rels",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`,
    ],
    ["xl/worksheets/sheet1.xml", sheetXml(columns, rows)],
  ]);
}

/* ------------------------------------------------------------------ ZIP -- */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

const u16 = (n: number): number[] => [n & 0xff, (n >>> 8) & 0xff];
const u32 = (n: number): number[] => [
  n & 0xff,
  (n >>> 8) & 0xff,
  (n >>> 16) & 0xff,
  (n >>> 24) & 0xff,
];

/** Método *store*: deflate exigiria o algoritmo inteiro por alguns kB de ganho. */
function zip(files: Array<[string, string]>): Blob {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const directory: number[] = [];
  let offset = 0;

  for (const [name, content] of files) {
    const nameBytes = encoder.encode(name);
    const data = encoder.encode(content);
    const crc = crc32(data);

    // 0x0800 = nome em UTF-8; data/hora fixas em 01/01/1980.
    const header = [
      ...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0),
      ...u16(0), ...u16(0x21),
      ...u32(crc), ...u32(data.length), ...u32(data.length),
      ...u16(nameBytes.length), ...u16(0),
    ];
    chunks.push(new Uint8Array(header), nameBytes, data);

    directory.push(
      ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0),
      ...u16(0), ...u16(0x21),
      ...u32(crc), ...u32(data.length), ...u32(data.length),
      ...u16(nameBytes.length), ...u16(0), ...u16(0),
      ...u16(0), ...u16(0), ...u32(0),
      ...u32(offset),
      ...Array.from(nameBytes)
    );

    offset += header.length + nameBytes.length + data.length;
  }

  chunks.push(
    new Uint8Array(directory),
    new Uint8Array([
      ...u32(0x06054b50), ...u16(0), ...u16(0),
      ...u16(files.length), ...u16(files.length),
      ...u32(directory.length), ...u32(offset), ...u16(0),
    ])
  );

  return new Blob(chunks as BlobPart[], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

/* ------------------------------------------------------------- download -- */

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
