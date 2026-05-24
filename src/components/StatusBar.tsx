export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-xs font-medium text-white/90">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <span className="inline-block h-2 w-2 rounded-full bg-white/80" />
        <span className="inline-block h-2 w-3 rounded-sm bg-white/80" />
        <span className="inline-block h-2.5 w-5 rounded-sm border border-white/70 relative">
          <span className="absolute inset-0.5 bg-white/80 rounded-[1px]" />
        </span>
      </div>
    </div>
  );
}
