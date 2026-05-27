import { ReactNode } from "react";
import { PhoneFrame } from "./PhoneFrame";
import { StatusBar } from "./StatusBar";
import { Link, useLocation } from "@tanstack/react-router";
import { Hop as Home, Clock, User, MapPin, Languages } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const navTabs = [
  { to: "/home", icon: Home, labelKey: "home" as const },
  { to: "/booking", icon: MapPin, labelKey: "ride" as const },
  { to: "/history", icon: Clock, labelKey: "trips" as const },
  { to: "/profile", icon: User, labelKey: "me" as const },
];

const languageTab = {
  icon: Languages,
  labelKey: "lang" as const,
  isLanguage: true,
} as const;

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
  const { t, language, setLanguage } = useLanguage();

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full min-h-screen sm:min-h-[860px] sm:h-[860px]">
        {!hideStatus && (
          <div className="flex items-center justify-between px-4 pt-2">
            {/* <StatusBar /> */}
          </div>
        )}
        <div className="flex-1 overflow-y-auto pb-24">{children}</div>
        {!hideNav && (
          <nav className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-2 bg-gradient-to-t from-[#0A0E27] via-[#0A0E27]/95 to-transparent">
            <div className="mx-auto bg-[#141B3D]/95 backdrop-blur border border-white/5 rounded-2xl px-2 py-2 flex items-center justify-around shadow-card">
              {navTabs.map((tab) => {
                const active = pathname === tab.to;
                const Icon = tab.icon;

                return (
                  <Link
                    key={tab.to}
                    to={tab.to}
                    className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all"
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
                      {t.tabs[tab.labelKey]}
                    </span>
                  </Link>
                );
              })}

              <button
                onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all hover:bg-white/5"
              >
                <div className="p-1.5 rounded-lg">
                  <languageTab.icon className="h-5 w-5 text-[#B8BED6]" />
                </div>
                <span className="text-[10px] font-medium text-[#B8BED6]">
                  {language === "fr" ? "FR" : "EN"}
                </span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </PhoneFrame>
  );
}
