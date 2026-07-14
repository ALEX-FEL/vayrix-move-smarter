type LatLng = { lat: number; lng: number };

interface MapViewProps {
  /** Point de départ (toujours requis) */
  origin: LatLng;
  /** Point d'arrivée. Si absent, la carte se centre juste sur `origin`. */
  destination?: LatLng;
  className?: string;
}

export function MapView({ origin, destination, className = "" }: MapViewProps) {
  // Astuce "output=embed" : ancien mécanisme d'intégration Google Maps,
  // gratuit et sans clé API (contrairement à l'Embed API officielle qui exige
  // désormais une clé + facturation). Fonctionne avec deux points via saddr/daddr.
  const src = destination
    ? `https://maps.google.com/maps?saddr=${origin.lat},${origin.lng}&daddr=${destination.lat},${destination.lng}&output=embed`
    : `https://maps.google.com/maps?q=${origin.lat},${origin.lng}&z=15&output=embed`;

  return (
    <div className={`absolute inset-0 overflow-hidden bg-[#0A0E27] ${className}`}>
      <iframe
        title="Carte"
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {/* Voile pour lisibilité des éléments superposés (header, carte chauffeur, etc.) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#0A0E27]/15 via-transparent to-[#0A0E27]/50" />
    </div>
  );
}