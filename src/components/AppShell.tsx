import { ReactNode } from "react";
import { PhoneFrame } from "./PhoneFrame";
import { StatusBar } from "./StatusBar";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, Clock, User } from "lucide-react";

const tabs = [
  { to: "/home", icon: Home, label: "" },
  { to: "/history", icon: Clock, label: "" },
  { to: "/profile", icon: User, label: "" },
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
      <div className="relative flex h-full flex-col overflow-hidden">

        {!hideStatus && <StatusBar />}

        <div
          className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden overscroll-contain"
          style={{
            paddingBottom: hideNav
              ? "1rem"
              : "calc(96px + env(safe-area-inset-bottom, 0px))",
          }}
        >
          {children}
        </div>

        {!hideNav && (
          <nav className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[88%] max-w-sm z-30">
            <div
              className="
                relative
                flex
                items-center
                justify-around
                h-[66px]
                px-3
                rounded-[26px]
                bg-[#111832]/90
                backdrop-blur-2xl
                border border-white/10
                shadow-[0_10px_40px_-8px_rgba(0,0,0,0.55)]
                overflow-hidden
              "
            >
              {tabs.map((t) => {
                const active = pathname === t.to;
                const Icon = t.icon;

                return (
                  <Link
                    key={t.to}
                    to={t.to}
                    className="relative flex flex-col items-center justify-center gap-1 flex-1 min-w-0 h-full"
                  >
                    <div
                      className={`
                        flex items-center justify-center shrink-0 w-9 h-9 rounded-full border
                        transition-all duration-300 ease-out
                        ${
                          active
                            ? "bg-gradient-primary border-white/70 -translate-y-[3px] shadow-[0_4px_14px_-2px_rgba(99,102,241,0.5)]"
                            : "bg-transparent border-white/20 translate-y-0"
                        }
                      `}
                    >
                      <Icon
                        strokeWidth={active ? 2.4 : 1.8}
                        className={`w-[18px] h-[18px] shrink-0 transition-all duration-300 ${
                          active ? "text-white scale-100" : "text-[#AAB2D5] scale-95"
                        }`}
                      />
                    </div>

                    <span
                      className={`text-[10px] font-medium tracking-wide leading-none whitespace-nowrap transition-all duration-300 ${
                        active ? "text-white opacity-100" : "text-[#AAB2D5] opacity-70"
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