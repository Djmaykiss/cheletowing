export const ownerWhatsAppNumber = import.meta.env.OWNER_WHATSAPP_NUMBER || import.meta.env.VITE_OWNER_WHATSAPP_NUMBER || "13053907779";

export function whatsappLink(number, message = "Hello Chele Towing, I would like a free vehicle estimate.") {
  const cleanNumber = (number || ownerWhatsAppNumber).replace(/\D/g, "");
  return cleanNumber ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}` : "#";
}

export function leadWhatsAppMessage(lead) {
  const answer = (value) => value ? "Yes / Sí" : "No";
  return [
    "NEW VEHICLE ESTIMATE / NUEVA COTIZACIÓN",
    "",
    `Owner / Dueño: ${lead.owner_name}`,
    `Phone / Teléfono: ${lead.phone}`,
    `Address / Dirección: ${lead.address}, ${lead.city}`,
    `Vehicle / Vehículo: ${lead.vehicle_year} ${lead.make} ${lead.model}`,
    `Condition / Estado: ${lead.vehicle_condition}`,
    `Title / Título: ${answer(lead.has_title)}`,
    `Catalytic / Catalítico: ${answer(lead.has_catalytic)}`,
    `Key / Llave: ${answer(lead.has_key)}`,
    `Runs / Prende: ${answer(lead.runs)}`,
    `Estimate / Estimado: $${lead.estimated_price_min} - $${lead.estimated_price_max}`,
    `Notes / Comentarios: ${lead.notes || "N/A"}`,
  ].join("\n");
}
