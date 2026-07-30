// Approximate coordinates for Kenyan counties / major towns.
// Used to prioritize marketplace listings near the buyer.

export const KENYA_PLACES: Record<string, { lat: number; lng: number }> = {
  nairobi: { lat: -1.2921, lng: 36.8219 },
  mombasa: { lat: -4.0435, lng: 39.6682 },
  kisumu: { lat: -0.0917, lng: 34.768 },
  nakuru: { lat: -0.3031, lng: 36.08 },
  eldoret: { lat: 0.5143, lng: 35.2698 },
  "uasin gishu": { lat: 0.5143, lng: 35.2698 },
  thika: { lat: -1.0333, lng: 37.0693 },
  kiambu: { lat: -1.1714, lng: 36.8356 },
  machakos: { lat: -1.5177, lng: 37.2634 },
  kajiado: { lat: -1.8527, lng: 36.7767 },
  nyeri: { lat: -0.4201, lng: 36.9476 },
  meru: { lat: 0.0463, lng: 37.6559 },
  embu: { lat: -0.5389, lng: 37.4575 },
  kakamega: { lat: 0.2827, lng: 34.7519 },
  bungoma: { lat: 0.5635, lng: 34.5606 },
  busia: { lat: 0.4608, lng: 34.1115 },
  kitale: { lat: 1.0157, lng: 35.0062 },
  "trans nzoia": { lat: 1.0157, lng: 35.0062 },
  nandi: { lat: 0.1833, lng: 35.1 },
  kericho: { lat: -0.3689, lng: 35.2863 },
  bomet: { lat: -0.7816, lng: 35.3416 },
  narok: { lat: -1.0833, lng: 35.8667 },
  laikipia: { lat: 0.3961, lng: 36.7819 },
  nyandarua: { lat: -0.3833, lng: 36.3667 },
  muranga: { lat: -0.7167, lng: 37.15 },
  "murang'a": { lat: -0.7167, lng: 37.15 },
  kirinyaga: { lat: -0.6591, lng: 37.3827 },
  kisii: { lat: -0.6817, lng: 34.7667 },
  migori: { lat: -1.0634, lng: 34.4731 },
  homabay: { lat: -0.5273, lng: 34.457 },
  "homa bay": { lat: -0.5273, lng: 34.457 },
  siaya: { lat: 0.0607, lng: 34.2881 },
  vihiga: { lat: 0.0667, lng: 34.7167 },
  garissa: { lat: -0.4569, lng: 39.6583 },
  isiolo: { lat: 0.3546, lng: 37.5822 },
  kitui: { lat: -1.3667, lng: 38.0106 },
  makueni: { lat: -1.8039, lng: 37.6203 },
  malindi: { lat: -3.2192, lng: 40.1169 },
  kilifi: { lat: -3.5107, lng: 39.9093 },
  kwale: { lat: -4.1737, lng: 39.4521 },
  lamu: { lat: -2.2717, lng: 40.902 },
  "taita taveta": { lat: -3.3167, lng: 38.35 },
  voi: { lat: -3.3961, lng: 38.5561 },
  turkana: { lat: 3.1167, lng: 35.6 },
  lodwar: { lat: 3.1191, lng: 35.5973 },
  marsabit: { lat: 2.3284, lng: 37.9899 },
  wajir: { lat: 1.7471, lng: 40.0573 },
  mandera: { lat: 3.9366, lng: 41.867 },
  samburu: { lat: 1.2153, lng: 36.9541 },
  "elgeyo marakwet": { lat: 0.8, lng: 35.4667 },
  "west pokot": { lat: 1.4, lng: 35.1167 },
  baringo: { lat: 0.4667, lng: 35.9667 },
  nyamira: { lat: -0.5633, lng: 34.9358 },
  tharaka: { lat: -0.1667, lng: 37.9667 },
  "tana river": { lat: -1.5, lng: 39.5 },
};

export const haversineKm = (
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(s)));
};

/** Resolve a free-text Kenyan location ("Nakuru, Kenya", "Thika Town") to coordinates. */
export const geocodeKenyanPlace = (location?: string | null) => {
  if (!location) return null;
  const clean = location.toLowerCase().replace(/,?\s*kenya/g, "").trim();
  if (KENYA_PLACES[clean]) return KENYA_PLACES[clean];
  const match = Object.keys(KENYA_PLACES).find(
    (key) => clean.includes(key) || key.includes(clean),
  );
  return match ? KENYA_PLACES[match] : null;
};

/** Distance in km between a buyer position and a listing's text location. */
export const distanceToListing = (
  buyer: { lat: number; lng: number } | null,
  listingLocation?: string | null,
) => {
  if (!buyer) return null;
  const place = geocodeKenyanPlace(listingLocation);
  if (!place) return null;
  return haversineKm(buyer, place);
};
