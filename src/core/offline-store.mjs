import { validateReadinessPack } from "./offline-readiness-pack.mjs";

export function serializeReadinessPack(pack, savedAt = new Date()) {
  return JSON.stringify({
    envelope_version: 1,
    saved_at: savedAt.toISOString(),
    pack
  });
}

export function restoreReadinessPack(serialized, now = new Date()) {
  let envelope;
  try {
    envelope = JSON.parse(serialized);
  } catch {
    return { restored: false, error: "INVALID_JSON", pack: null };
  }

  if (envelope?.envelope_version !== 1 || !envelope.pack) {
    return { restored: false, error: "INVALID_ENVELOPE", pack: null };
  }

  const validation = validateReadinessPack(envelope.pack, now);
  return {
    restored: validation.valid_structure,
    error: validation.valid_structure ? null : "INVALID_PACK",
    pack: validation.valid_structure ? envelope.pack : null,
    validation,
    saved_at: envelope.saved_at || null
  };
}
