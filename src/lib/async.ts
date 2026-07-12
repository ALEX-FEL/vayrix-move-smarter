// Simulate network latency + occasional failure for mock services.
export const delay = (ms = 600) => new Promise<void>((r) => setTimeout(r, ms));

export const maybeFail = (rate = 0) => {
  if (rate > 0 && Math.random() < rate) {
    throw new Error("Network error — please retry.");
  }
};

export const pickWeighted = <T,>(items: [T, number][]): T => {
  const total = items.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [v, w] of items) {
    if ((r -= w) <= 0) return v;
  }
  return items[0][0];
};

export const uid = (prefix = "id") =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
