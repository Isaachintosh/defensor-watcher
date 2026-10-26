function dateInRange(protocol, now) {
  const t = now.getTime();
  const from = protocol.valid_from ? new Date(protocol.valid_from).getTime() : -Infinity;
  const until = protocol.valid_until ? new Date(protocol.valid_until).getTime() : Infinity;
  return !Number.isNaN(from) && !Number.isNaN(until) && t >= from && t <= until;
}

export function selectProtocols({ protocols = [], event, jurisdiction, now = new Date() }) {
  return protocols.filter(protocol => {
    if (!protocol.source_reference || !protocol.authority) return false;
    if (protocol.status && protocol.status !== "ACTIVE") return false;
    if (!dateInRange(protocol, now)) return false;
    if (protocol.jurisdiction && jurisdiction && protocol.jurisdiction !== jurisdiction) return false;
    if ((protocol.applicable_event_types || []).length &&
        !(protocol.applicable_event_types || []).includes(event.type)) return false;

    const conditions = protocol.applicable_conditions || [];
    return conditions.every(condition => {
      if (condition === "ANY") return true;
      return (event.conditions || []).includes(condition);
    });
  });
}

export function guidanceFromProtocol(protocol, translation = null) {
  if (!protocol?.source_reference || !protocol?.authority) {
    throw new Error("NO_GUIDANCE_WITHOUT_PROVENANCE");
  }
  return {
    protocol_id: protocol.protocol_id,
    authority: protocol.authority,
    jurisdiction: protocol.jurisdiction,
    action: protocol.action,
    original_text: protocol.original_text,
    translation,
    source_reference: protocol.source_reference,
    urgency: protocol.urgency || "ADVISORY",
    active: true,
  };
}
