import { useLanguage } from "@/hooks/use-language";
import { Video as LucideIcon, Languages } from "lucide-react";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
      className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all hover:bg-white/5"
    >
      <div className="p-1.5 rounded-lg">
        <Languages className="h-5 w-5 text-[#B8BED6]" />
      </div>
      <span className="text-[10px] font-semibold text-[#B8BED6]">
        {language === "fr" ? "FR" : "AN"}
      </span>
    </button>
  );
}
