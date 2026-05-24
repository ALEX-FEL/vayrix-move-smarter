import { useState, useEffect } from "react";
import { X, Check, Bike, Car, Crown, Clock, Users, Zap } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

type VehicleType = "moto" | "standard" | "premium";

const vehicleData: {
  [key in VehicleType]: {
    image: string;
    basePrice: number;
    multiplier: number;
    icon: typeof Bike;
    eta: string;
    capacity: number;
  };
} = {
  moto: {
    image: "https://images.unsplash.com/photo-1558981806-ec5f2d0c4c7b?w=800&auto=format&fit=crop&q=60",
    basePrice: 500,
    multiplier: 0.7,
    icon: Bike,
    eta: "2-4 min",
    capacity: 1,
  },
  standard: {
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=60",
    basePrice: 1000,
    multiplier: 1.0,
    icon: Car,
    eta: "3-5 min",
    capacity: 4,
  },
  premium: {
    image: "https://images.unsplash.com/photo-1503376780353-7e8893495856?w=800&auto=format&fit=crop&q=60",
    basePrice: 2000,
    multiplier: 1.5,
    icon: Crown,
    eta: "4-6 min",
    capacity: 4,
  },
};

export function VehicleSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  distance = 7.8,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (vehicle: VehicleType, price: number) => void;
  distance?: number;
}) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<VehicleType | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelected(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const calculatePrice = (vehicle: VehicleType): number => {
    const { basePrice, multiplier } = vehicleData[vehicle];
    return Math.round(basePrice * multiplier * (distance / 5));
  };

  const handleConfirm = () => {
    if (selected) {
      const price = calculatePrice(selected);
      onConfirm(selected, price);
      onClose();
    }
  };

  const vehicles: VehicleType[] = ["moto", "standard", "premium"];

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed inset-x-0 bottom-0 z-[70] max-h-[90vh] overflow-y-auto rounded-t-[32px] bg-gradient-to-b from-[#141B3D] via-[#0f1628] to-[#0A0E27] border-t border-white/10 shadow-2xl animate-slide-up sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:rounded-3xl sm:border"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="sticky top-0 bg-gradient-to-b from-[#141B3D] to-transparent z-10 pb-4">
          <div className="flex items-center justify-between px-5 pt-5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gradient-primary">
                  {t.vehicle.selectTitle}
                </h2>
                <p className="text-xs text-[#B8BED6]">{t.vehicle.selectSubtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-full bg-[#0A0E27] border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-[#B8BED6]" />
            </button>
          </div>

          <div className="absolute top-2 left-1/2 -translate-x-1/2 h-1 w-12 rounded-full bg-white/20 sm:hidden" />
        </div>

        <div className="px-5 pb-6 space-y-3">
          {vehicles.map((vehicle) => {
            const price = calculatePrice(vehicle);
            const isSelected = selected === vehicle;
            const Icon = vehicleData[vehicle].icon;

            return (
              <button
                key={vehicle}
                onClick={() => setSelected(vehicle)}
                className={`relative w-full rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                  isSelected
                    ? "border-[#7B5CFF] shadow-glow"
                    : "border-white/5 hover:border-white/15"
                }`}
              >
                <div className="relative h-36 sm:h-32 overflow-hidden">
                  <img
                    src={vehicleData[vehicle].image}
                    alt={vehicle}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      isSelected ? "scale-105" : "scale-100"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-[#0A0E27]/40 to-transparent" />

                  <div className="absolute top-3 right-3 h-11 w-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                    <Icon className="h-5 w-5 text-white" />
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
                        <Clock className="h-3 w-3 text-white" />
                        <span className="text-xs font-medium text-white">{vehicleData[vehicle].eta}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
                        <Users className="h-3 w-3 text-white" />
                        <span className="text-xs font-medium text-white">{vehicleData[vehicle].capacity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#141B3D] border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-base font-bold text-white">
                        {t.vehicle[vehicle]}
                      </p>
                      <p className="text-xs text-[#B8BED6]">
                        {t.vehicle[`${vehicle}Subtitle`]}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xl font-bold text-gradient-primary tabular-nums">
                          {price.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-[#B8BED6]">XAF</p>
                      </div>
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-gradient-primary shadow-glow"
                            : "border-2 border-white/20"
                        }`}
                      >
                        {isSelected && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          <button
            onClick={handleConfirm}
            disabled={!selected}
            className={`w-full h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
              selected
                ? "bg-gradient-primary text-white shadow-glow active:scale-[0.98]"
                : "bg-[#1a2348] text-[#B8BED6] cursor-not-allowed"
            }`}
          >
            {selected ? (
              <>
                {t.vehicle.confirm}
                <Check className="h-5 w-5" />
              </>
            ) : (
              t.vehicle.selectSubtitle
            )}
          </button>
        </div>
      </div>
    </>
  );
}
