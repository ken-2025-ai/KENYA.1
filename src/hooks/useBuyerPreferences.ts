import { useCallback, useEffect, useState } from "react";

export interface BuyerEvent {
  id: string;
  title: string;
  category: string;
  location: string;
  price: number;
  type: "view" | "contact" | "search";
  at: number;
}

export interface BuyerProfile {
  events: BuyerEvent[];
  topCategories: string[];
  avgPrice: number | null;
  recentSearches: string[];
}

const KEY = "agro_buyer_history_v1";
const MAX_EVENTS = 60;

const read = (): BuyerEvent[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BuyerEvent[]) : [];
  } catch {
    return [];
  }
};

const summarize = (events: BuyerEvent[]): BuyerProfile => {
  const weights: Record<string, number> = {};
  let priceSum = 0;
  let priceCount = 0;

  events.forEach((e) => {
    const weight = e.type === "contact" ? 3 : e.type === "view" ? 1 : 0.5;
    if (e.category) {
      weights[e.category.toLowerCase()] =
        (weights[e.category.toLowerCase()] || 0) + weight;
    }
    if (e.price && e.type !== "search") {
      priceSum += e.price;
      priceCount += 1;
    }
  });

  return {
    events,
    topCategories: Object.entries(weights)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([c]) => c),
    avgPrice: priceCount ? Math.round(priceSum / priceCount) : null,
    recentSearches: events
      .filter((e) => e.type === "search" && e.title)
      .slice(0, 5)
      .map((e) => e.title),
  };
};

export const useBuyerPreferences = () => {
  const [profile, setProfile] = useState<BuyerProfile>(() => summarize(read()));

  useEffect(() => {
    setProfile(summarize(read()));
  }, []);

  const track = useCallback((event: Omit<BuyerEvent, "at">) => {
    const events = [{ ...event, at: Date.now() }, ...read()].slice(0, MAX_EVENTS);
    try {
      localStorage.setItem(KEY, JSON.stringify(events));
    } catch {
      /* storage full or unavailable */
    }
    setProfile(summarize(events));
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(KEY);
    setProfile(summarize([]));
  }, []);

  return { profile, track, clear };
};
