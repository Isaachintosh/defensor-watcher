const TYPES = new Set(["ALERT","UPDATE","CANCEL"]);

export function applyEventMessage(current, message = {}) {
  if (!message.logical_event_id) throw new Error("LOGICAL_EVENT_ID_REQUIRED");
  if (!TYPES.has(message.message_type)) throw new Error("INVALID_MESSAGE_TYPE");

  const sequence = Number(message.sequence);
  if (!Number.isFinite(sequence)) throw new Error("SEQUENCE_REQUIRED");

  if (current && current.logical_event_id !== message.logical_event_id) {
    throw new Error("LOGICAL_EVENT_ID_MISMATCH");
  }

  if (current && sequence <= current.sequence) {
    return { ...current, last_transition: "IGNORED_STALE_MESSAGE" };
  }

  if (current?.status === "CANCELLED" && message.message_type !== "CANCEL") {
    return { ...current, last_transition: "IGNORED_AFTER_CANCEL" };
  }

  const history = [...(current?.history || []), {
    message_type: message.message_type,
    sequence,
    received_at: message.received_at || null,
    source_reference: message.source_reference || null
  }];

  if (message.message_type === "CANCEL") {
    return {
      logical_event_id: message.logical_event_id,
      sequence,
      status: "CANCELLED",
      payload: current?.payload || null,
      history,
      last_transition: "CANCELLED"
    };
  }

  return {
    logical_event_id: message.logical_event_id,
    sequence,
    status: "ACTIVE",
    payload: message.payload ?? current?.payload ?? null,
    history,
    last_transition: current ? "UPDATED" : "CREATED"
  };
}
