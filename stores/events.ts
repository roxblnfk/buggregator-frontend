import { defineStore } from "pinia";
import {
  EventId,
  OneOfValues,
  ServerEvent,
} from "~/config/types";
import { EVENT_TYPES } from "~/config/constants";

export const useEventStore = defineStore("useEventStore", {
  state: () => ({
    events: [] as ServerEvent<unknown>[],
    cachedEvents: [] as ServerEvent<unknown>[],
  }),
  getters: {
    rayEvents: (state) =>
      state.events.filter(({ type }) => type === EVENT_TYPES.RAY_DUMP),
    varDumpEvents: (state) =>
      state.events.filter(({ type }) => type === EVENT_TYPES.VAR_DUMP),
    sentryEvents: (state) =>
      state.events.filter(({ type }) => type === EVENT_TYPES.SENTRY),
    inspectorEvents: (state) =>
      state.events.filter(({ type }) => type === EVENT_TYPES.INSPECTOR),
    profilerEvents: (state) =>
      state.events.filter(({ type }) => type === EVENT_TYPES.PROFILER),
    smtpEvents: (state) =>
      state.events.filter(({ type }) => type === EVENT_TYPES.SMTP),
    httpDumpEvents: (state) =>
      state.events.filter(({ type }) => type === EVENT_TYPES.HTTP_DUMP),

    cachedRayEvents: (state) =>
      state.cachedEvents.filter(({ type }) => type === EVENT_TYPES.RAY_DUMP),
    cachedVarDumpEvents: (state) =>
      state.cachedEvents.filter(({ type }) => type === EVENT_TYPES.VAR_DUMP),
    cachedSentryEvents: (state) =>
      state.cachedEvents.filter(({ type }) => type === EVENT_TYPES.SENTRY),
    cachedInspectorEvents: (state) =>
      state.cachedEvents.filter(({ type }) => type === EVENT_TYPES.INSPECTOR),
    cachedProfilerEvents: (state) =>
      state.cachedEvents.filter(({ type }) => type === EVENT_TYPES.PROFILER),
    cachedSmtpEvents: (state) =>
      state.cachedEvents.filter(({ type }) => type === EVENT_TYPES.SMTP),
    cachedHttpDumpEvents: (state) =>
      state.cachedEvents.filter(({ type }) => type === EVENT_TYPES.HTTP_DUMP),
  },
  actions: {
    removeEventById(eventUuid: EventId) {
      this.events = this.events.filter(({ uuid }) => uuid !== eventUuid);

      this.cachedEvents = this.cachedEvents.filter(
        ({ uuid }) => uuid !== eventUuid
      );
    },
    removeEvents() {
      this.events.length = 0;

      this.cachedEvents.length = 0;
    },
    removeEventsByType(eventType: OneOfValues<typeof EVENT_TYPES>) {
      this.events = this.events.filter(({ type }) => type !== eventType);
      this.cachedEvents = this.cachedEvents.filter(
        ({ type }) => type !== eventType
      );
    },
    addEvents(events: ServerEvent<unknown>[]) {
      events.forEach((event) => {
        const isExistedEvent = this.events.some((el) => el.uuid === event.uuid);
        if (!isExistedEvent) {
          this.events.unshift(event);
        } else {
          this.events = this.events.map((el) => {
            if (el.uuid === event.uuid) {
              return event;
            }
            return el;
          });
        }
      });
    },
    setCachedEvents(cachedType: OneOfValues<typeof EVENT_TYPES> | null) {
      if (cachedType === null) {
        this.cachedEvents = this.events;
      } else {
        this.cachedEvents = this.events.filter(
          ({ type }) => type === cachedType
        );
      }
    },
    getEventById(id: EventId): ServerEvent<unknown> | null {
      return (
        this.events.find(({ uuid }) => String(uuid) === String(id)) || null
      );
    },
  },
});
