import { ReactNode } from "react";
import type { AsyncState } from "@/models";
import { Inbox, AlertTriangle, Loader2 } from "lucide-react";

type Props<T> = {
  state: AsyncState<T>;
  children: (data: T) => ReactNode;
  emptyLabel?: string;
  onRetry?: () => void;
};

export function QueryView<T>({ state, children, emptyLabel = "Aucun résultat", onRetry }: Props<T>) {
  if (state.status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-[#B8BED6]">
        <Loader2 className="h-6 w-6 animate-spin text-[#7B5CFF]" />
        <p className="mt-3 text-xs">Chargement…</p>
      </div>
    );
  }
  if (state.status === "empty") {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-[#B8BED6]">
        <div className="h-14 w-14 rounded-2xl bg-[#141B3D] border border-white/5 flex items-center justify-center">
          <Inbox className="h-6 w-6" />
        </div>
        <p className="mt-3 text-sm">{emptyLabel}</p>
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center px-6">
        <div className="h-14 w-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-red-300" />
        </div>
        <p className="mt-3 text-sm text-white">{state.message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 h-10 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-glow"
          >
            Réessayer
          </button>
        )}
      </div>
    );
  }
  return <>{children(state.data)}</>;
}
