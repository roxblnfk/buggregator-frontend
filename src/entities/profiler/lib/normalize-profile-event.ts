import { EVENT_TYPES, ServerEvent } from "~/src/shared/types";
import { NormalizedProfiler, Profiler } from "../types";

export const normalizeProfilerEvent = (event: ServerEvent<Profiler>): NormalizedProfiler => ({
  id: event.uuid,
  type: EVENT_TYPES.PROFILER,
  labels: [EVENT_TYPES.PROFILER],
  origin: {name: event.payload.app_name, ...event.payload.tags},
  serverName: event.payload.hostname,
  date: event.timestamp ? new Date(event.timestamp * 1000) : null,
  payload: event.payload
})
