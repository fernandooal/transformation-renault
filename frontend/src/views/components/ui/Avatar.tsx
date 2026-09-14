import { UserGlyph } from "../icons";
import { cx } from "../../../utils/cx";

export interface AvatarProps {
  name?: string;
  src?: string;
  size?: 24 | 32 | 40 | 48;
  className?: string;
}

export default function Avatar({ name, src, size = 32, className }: AvatarProps) {
  return (
    <span
      className={cx("avatar", className)}
      style={{ width: size, height: size }}
      title={name}
    >
      {src ? <img src={src} alt={name ?? ""} /> : <UserGlyph size={size} />}
    </span>
  );
}
