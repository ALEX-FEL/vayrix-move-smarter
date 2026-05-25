import { ReactNode } from "react";
import { PhoneFrame } from "./PhoneFrame";
import { StatusBar } from "./StatusBar";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, Clock, User, MapPin } from "lucide-react";

const tabs = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/booking", icon: MapPin, label: "Ride" },
  { to: "/history", icon: Clock, label: "Trips" },
  { to: "/profile", icon: User, label: "Me" },
] as const;

export function AppShell({
  children,
  hideNav = false,
  hideStatus = false,
}: {
  children: ReactNode;
  hideNav?: boolean;
  hideStatus?: boolean;
}) {
  const { pathname } = useLocation();
  return (
    <PhoneFrame>
      <div className="flex flex-col h-full min-h-screen sm:min-h-[860px] sm:h-[860px]">
        {!hideStatus && <StatusBar />}
        <div className="flex-1 overflow-y-auto pb-24">{children}</div>
        {!hideNav && (
          <nav className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-2 bg-gradient-to-t from-[#0A0E27] via-[#0A0E27]/95 to-transparent">
            <div className="mx-auto bg-[#141B3D]/95 backdrop-blur border border-white/5 rounded-2xl px-2 py-2 flex items-center justify-around shadow-card">
              {tabs.map((t) => {
                const active = pathname === t.to;
                const Icon = t.icon;
                return (
                  <Link
                    key={t.to}
                    to={t.to}
                    className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all"
                  >
                    <div
                      className={`p-1.5 rounded-lg transition-all ${
                        active ? "bg-gradient-primary shadow-glow" : ""
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${active ? "text-white" : "text-[#B8BED6]"}`}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-medium ${
                        active ? "text-white" : "text-[#B8BED6]"
                      }`}
                    >
                      {t.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </PhoneFrame>
  );
}
