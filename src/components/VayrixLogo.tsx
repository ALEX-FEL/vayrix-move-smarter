import logoAsset from "@/assets/vayrix-logo.png.asset.json";

export function VayrixLogo({ size = 88 }: { size?: number }) {
  return (
    <img
      src={logoAsset.url}
      alt="Vayrix"
      width={size}
      height={size}
      className="rounded-3xl object-cover shadow-glow"
      style={{ width: size, height: size }}
    />
  );
}
