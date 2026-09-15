export interface SkeletonProps {
  width?: string;
  height?: string;
  radius?: string;
}

export default function Skeleton({ width = "100%", height = "1rem", radius }: SkeletonProps) {
  return (
    <span
      className="skeleton"
      aria-hidden="true"
      style={{ width, height, borderRadius: radius, display: "block" }}
    />
  );
}
