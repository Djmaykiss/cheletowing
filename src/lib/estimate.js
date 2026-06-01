const conditionValues = {
  good: [1000, 2100],
  fair: [650, 1450],
  damaged: [350, 950],
  not_running: [200, 650],
  junk: [150, 450],
};

export function calculateEstimate({ vehicle_year, vehicle_condition, runs, has_title, has_catalytic, has_key }) {
  const currentYear = new Date().getFullYear();
  const year = Number(vehicle_year) || 2000;
  const ageBonus = Math.max(0, 20 - Math.max(0, currentYear - year)) * 40;
  const [conditionMin, conditionMax] = conditionValues[vehicle_condition] || conditionValues.junk;
  let min = conditionMin + ageBonus;
  let max = conditionMax + ageBonus * 2;

  if (runs) { min += 250; max += 500; }
  if (has_title) { min += 150; max += 250; }
  if (has_catalytic) { min += 100; max += 200; }
  if (has_key) { min += 50; max += 100; }

  return {
    min: Math.max(100, Math.round(min / 50) * 50),
    max: Math.max(250, Math.round(max / 50) * 50),
  };
}

export const money = (value) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
}).format(value);
