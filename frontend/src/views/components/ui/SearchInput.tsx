import { Icon } from "../icons";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "busque uma f4 aqui...",
  label = "Buscar",
}: SearchInputProps) {
  return (
    <label className="search">
      <span className="sr-only">{label}</span>
      <input
        type="search"
        className="control"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="search__icon">
        <Icon name="search" size={20} />
      </span>
    </label>
  );
}
