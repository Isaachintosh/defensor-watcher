export function resolveLocationContext({ gps = null, configured_areas = [] } = {}) {
  if (
    gps &&
    gps.available === true &&
    Number.isFinite(gps.latitude) &&
    Number.isFinite(gps.longitude)
  ) {
    return {
      state: "KNOWN",
      source: "GPS",
      coordinates: { latitude: gps.latitude, longitude: gps.longitude },
      configured_areas
    };
  }

  if (Array.isArray(configured_areas) && configured_areas.length > 0) {
    return {
      state: "PARTIAL",
      source: "CONFIGURED_AREAS",
      coordinates: null,
      configured_areas
    };
  }

  return {
    state: "UNKNOWN",
    source: "NONE",
    coordinates: null,
    configured_areas: []
  };
}
