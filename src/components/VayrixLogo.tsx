import logo from "@/assets/lo.jpeg";

export function VayrixLogo({ size = 88 }: { size?: number }) {
  return (
    <img
      src={logo}
      alt="Vayrix"
      width={size}
      height={size}
      className="rounded-3xl object-cover shadow-glow"
      style={{ width: size, height: size }}
    />
  );
}
