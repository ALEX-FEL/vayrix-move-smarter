import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, opts?: Record<string, unknown>) => unknown;
        Marker: new (opts?: Record<string, unknown>) => unknown;
        DirectionsService: new () => unknown;
        DirectionsRenderer: new (opts?: Record<string, unknown>) => unknown;
        TravelMode: {
          DRIVING: string;
          WALKING: string;
          BICYCLING: string;
          TRANSIT: string;
        };
        ControlPosition: {
          TOP_RIGHT: number;
          RIGHT_CENTER: number;
          BOTTOM_RIGHT: number;
        };
        SymbolPath: {
          CIRCLE: number;
          FORWARD_CLOSED_ARROW: number;
          BACKWARD_CLOSED_ARROW: number;
        };
      };
    };
    initGoogleMap?: () => void;
  }
}

type GoogleMapType = {
  setCenter: (latlng: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  setMapTypeId: (mapTypeId: string) => void;
  setOptions: (opts: Record<string, unknown>) => void;
  addListener: (event: string, handler: (e: GoogleMapMouseEvent) => void) => void;
};

type GoogleMapMouseEvent = {
  latLng: {
    lat: () => number;
    lng: () => number;
  };
};

type GoogleMarker = {
  setMap: (map: GoogleMapType | null) => void;
};

type GoogleDirectionsService = {
  route: (
    request: {
      origin: { lat: number; lng: number };
      destination: { lat: number; lng: number };
      travelMode: string;
    },
    callback: (result: unknown, status: string) => void
  ) => void;
};

type GoogleDirectionsRenderer = {
  setMap: (map: GoogleMapType | null) => void;
  setDirections: (result: unknown) => void;
};

type MapStyle = "roadmap" | "satellite" | "terrain" | "hybrid";

type GoogleMapProps = {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    icon?: string;
  }>;
  drivers?: Array<{
    position: { lat: number; lng: number };
    name: string;
  }>;
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  showRoute?: boolean;
  showControls?: boolean;
  className?: string;
  onMapClick?: (lat: number, lng: number) => void;
};

export function GoogleMap({
  center = { lat: 3.848, lng: 11.502 },
  zoom = 14,
  markers = [],
  drivers = [],
  origin,
  destination,
  showRoute = false,
  showControls = true,
  className = "",
  onMapClick,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMapType | null>(null);
  const [currentStyle, setCurrentStyle] = useState<MapStyle>("roadmap");
  const [isLoading, setIsLoading] = useState(true);
  const markersRef = useRef<GoogleMarker[]>([]);
  const driversRef = useRef<GoogleMarker[]>([]);
  const directionsRendererRef = useRef<GoogleDirectionsRenderer | null>(null);
  const directionsServiceRef = useRef<GoogleDirectionsService | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("Google Maps API key is missing");
      setIsLoading(false);
      return;
    }

    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    window.initGoogleMap = initMap;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&callback=initGoogleMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      const scriptElement = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, []);

  function initMap() {
    if (!mapRef.current) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: getDarkMapStyle(),
      disableDefaultUI: !showControls,
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: window.google.maps.ControlPosition.TOP_RIGHT,
        mapTypeIds: ["roadmap", "satellite", "terrain", "hybrid"],
      },
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: showControls,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER,
      },
    }) as unknown as GoogleMapType;

    mapInstance.setMapTypeId(currentStyle);

    if (onMapClick) {
      mapInstance.addListener("click", (e: GoogleMapMouseEvent) => {
        if (e.latLng) {
          onMapClick(e.latLng.lat(), e.latLng.lng());
        }
      });
    }

    setMap(mapInstance);
    setIsLoading(false);

    directionsServiceRef.current = new window.google.maps.DirectionsService() as unknown as GoogleDirectionsService;
    const renderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: "#7B5CFF",
        strokeWeight: 4,
      },
    }) as unknown as GoogleDirectionsRenderer;
    renderer.setMap(mapInstance);
    directionsRendererRef.current = renderer;
  }

  useEffect(() => {
    if (!map) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    markers.forEach((m) => {
      const markerInstance = new window.google.maps.Marker({
        position: m.position,
        map,
        title: m.title,
        icon: m.icon || undefined,
      }) as unknown as GoogleMarker;
      markersRef.current.push(markerInstance);
    });
  }, [map, markers]);

  useEffect(() => {
    if (!map) return;

    driversRef.current.forEach((marker) => marker.setMap(null));
    driversRef.current = [];

    drivers.forEach((driver) => {
      const markerInstance = new window.google.maps.Marker({
        position: driver.position,
        map,
        title: driver.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#3B6BFF",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        },
      }) as unknown as GoogleMarker;
      driversRef.current.push(markerInstance);
    });
  }, [map, drivers]);

  useEffect(() => {
    if (!map || !showRoute || !origin || !destination || !directionsServiceRef.current || !directionsRendererRef.current) {
      const renderer = directionsRendererRef.current;
      if (renderer) {
        renderer.setDirections({ routes: [] });
      }
      return;
    }

    const renderer = directionsRendererRef.current;
    directionsServiceRef.current.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result && renderer) {
          renderer.setDirections(result);
        }
      }
    );
  }, [map, showRoute, origin, destination]);

  useEffect(() => {
    if (map) {
      map.setMapTypeId(currentStyle);
      if (currentStyle !== "satellite" && currentStyle !== "hybrid") {
        map.setOptions({ styles: getDarkMapStyle() });
      } else {
        map.setOptions({ styles: [] });
      }
    }
  }, [map, currentStyle]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#0A0E27] flex items-center justify-center z-10">
          <div className="text-sm text-[#B8BED6]">Loading map...</div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}

function getDarkMapStyle() {
  return [
    { elementType: "geometry", stylers: [{ color: "#0A0E27" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0A0E27" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#B8BED6" }] },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#1a2350" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#141B3D" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#060812" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#141B3D" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#0f1628" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#141B3D" }],
    },
  ];
}
