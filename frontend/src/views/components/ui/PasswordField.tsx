import { useState } from "react";
import TextField from "./TextField";
import type { TextFieldProps } from "./TextField";
import IconButton from "./IconButton";
import { Icon } from "../icons";

export type PasswordFieldProps = Omit<TextFieldProps, "type" | "rightSlot">;

export default function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      autoComplete={props.autoComplete ?? "current-password"}
      rightSlot={
        <IconButton
          label={visible ? "Ocultar senha" : "Mostrar senha"}
          variant={props.tone === "onDark" ? "onDark" : "ghost"}
          icon={<Icon name={visible ? "eye" : "eyeOff"} size={20} />}
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
        />
      }
    />
  );
}
