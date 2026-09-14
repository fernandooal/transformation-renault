import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";

export interface CheckboxProps {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  tone?: "light" | "onDark";
  name?: string;
}

export default function Checkbox({ label, checked, onChange, tone = "light", name }: CheckboxProps) {
  return (
    <label className={cx("checkbox", tone === "onDark" && "checkbox--onDark")}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
