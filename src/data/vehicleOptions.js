const otherOption = "Other / Otro";

export const vehicleYears = Array.from(
  { length: new Date().getFullYear() - 1899 },
  (_, index) => new Date().getFullYear() - index,
);

export const vehicleModelsByMake = {
  Toyota: ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "Tundra", "Prius"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "Odyssey", "Fit"],
  Nissan: ["Altima", "Sentra", "Rogue", "Pathfinder", "Frontier", "Maxima"],
  Ford: ["F-150", "Explorer", "Escape", "Mustang", "Focus", "Fusion"],
  Chevrolet: ["Silverado", "Malibu", "Equinox", "Tahoe", "Impala", "Cruze"],
  Hyundai: ["Elantra", "Sonata", "Santa Fe", "Tucson", "Accent", "Kona"],
  Kia: ["Forte", "Optima", "Sorento", "Sportage", "Soul", "Rio"],
  Dodge: ["Charger", "Challenger", "Durango", "Journey", "Grand Caravan", "Ram 1500"],
  Jeep: ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade", "Patriot"],
  BMW: ["3 Series", "5 Series", "X1", "X3", "X5", "X7"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE"],
  Volkswagen: ["Jetta", "Passat", "Tiguan", "Atlas", "Golf", "Beetle"],
};

export const vehicleMakes = [...Object.keys(vehicleModelsByMake), otherOption];

export function getVehicleModels(make) {
  if (!make) return [];
  return [...(vehicleModelsByMake[make] || []), otherOption];
}

export { otherOption };
