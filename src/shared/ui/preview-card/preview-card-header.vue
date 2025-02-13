<script lang="ts" setup>
import { computed } from "vue";
import type { EventType } from "../../types";
import { IconSvg } from "../icon-svg";
import { DownloadType } from "./types";

type Props = {
  eventType: EventType | "unknown";
  eventId: string;
  eventUrl: string;
  tags: string[];
  isOpen: boolean;
  isLocked: boolean;
  isVisibleControls: boolean;
};

type Emits = {
  delete: [value: boolean];
  toggleView: [value: boolean];
  copy: [value: boolean];
  download: [value: DownloadType];
  lock: [value: boolean];
};

const props = withDefaults(defineProps<Props>(), {
  tags: () => [],
  eventUrl: "",
});

const emit = defineEmits<Emits>();

const changeView = () => {
  emit("toggleView", true);
};

const deleteEvent = () => {
  emit("delete", true);
};

const copyEvent = () => {
  emit("copy", true);
};

const downloadImageEvent = () => {
  emit("download", DownloadType.Image);
};

const downloadFile = () => {
  emit("download", DownloadType.File);
};

const lockEvent = () => {
  emit("lock", true);
};

const isVisibleTags = computed(() => props.tags.length > 0);
</script>

<template>
  <div class="preview-card-header">
    <div class="preview-card-header__tags">
      <a
        v-if="eventUrl"
        :href="eventUrl"
        target="_blank"
        class="preview-card-header__tag preview-card-header__tag--json"
        title="Open JSON payload for this event in new tab"
      >
        JSON
      </a>

      <template v-if="isVisibleTags">
        <div
          v-for="tag in tags"
          :key="tag"
          ref="tags"
          class="preview-card-header__tag"
          :class="`preview-card-header__tag--${eventType}`"
        >
          {{ tag }}
        </div>
      </template>
    </div>

    <div v-if="isVisibleControls" class="preview-card-header__buttons">
      <div class="preview-card-header__buttons-expand">
        <button
          class="preview-card-header__button preview-card-header__button--copy"
          title="Copy event as PNG image to clipboard"
          @click="copyEvent"
        >
          <IconSvg name="copy" class="preview-card-header__button-icon" />
        </button>

        <div class="preview-card-header__buttons-expand-list">
          <button
            class="preview-card-header__button preview-card-header__button--copy"
            title="Download event as JSON file"
            @click="downloadFile"
          >
            <IconSvg
              name="file-download"
              class="preview-card-header__button-icon"
            />
          </button>

          <button
            class="preview-card-header__button preview-card-header__button--copy"
            @click="downloadImageEvent"
            title="Download event as PNG image"
          >
            <IconSvg
              name="image-download"
              class="preview-card-header__button-icon"
            />
          </button>
        </div>
      </div>

      <button
        class="preview-card-header__button preview-card-header__button--collapse"
        :class="{ 'preview-card-header__button--collapse-closed': !isOpen }"
        title="Collapse event"
        @click="changeView"
      >
        <IconSvg
          v-if="isOpen"
          name="minus"
          class="preview-card-header__button-icon"
        />
        <IconSvg
          v-if="!isOpen"
          name="plus"
          class="preview-card-header__button-icon"
        />
      </button>

      <button
        class="preview-card-header__button preview-card-header__button--lock"
        title="Lock event. Locked events will not be deleted"
        :class="{
          'preview-card-header__button--locked': isLocked,
        }"
        @click="lockEvent"
      >
        <IconSvg name="lock" class="preview-card-header__button-icon" />
      </button>

      <button
        class="preview-card-header__button preview-card-header__button--delete"
        title="Delete event"
        :disabled="isLocked"
        @click="deleteEvent"
      >
        <IconSvg name="times" class="preview-card-header__button-icon" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$eventTypeColorsMap: (
  "var-dump" "red",
  "smtp" "orange",
  "sentry" "pink",
  "profiler" "purple",
  "monolog" "gray",
  "inspector" "gray",
  "ray" "gray",
  "unknown" "gray"
);

.preview-card-header {
  @apply w-full flex sm:flex-row flex-col-reverse justify-between gap-y-3;
}

.preview-card-header__tags {
  @apply flex flex-wrap gap-3;
}

.preview-card-header__tag {
  @apply font-bold px-2 rounded-full text-xs inline-flex items-center transition-colors border dark:border-gray-600 cursor-help;

  /* Applied tailwind classes depends on event type
   Need to keep declaration for tailwind correct work:
   'var-dump' 'bg-red-50 dark:bg-red-700 text-red-800 dark:text-red-50 dark:border-red-600' 'bg-red-100 dark:bg-red-500',
   'Smtp' 'bg-orange-50 dark:bg-orange-700 text-orange-800 dark:text-orange-50 dark:border-orange-600' 'bg-orange-100 dark:bg-orange-500',
   'Sentry' 'bg-pink-50 dark:bg-pink-700 text-pink-800 dark:text-pink-50 dark:border-pink-600' 'bg-pink-100 dark:bg-pink-500',
   'profiler' 'bg-purple-50 dark:bg-purple-700 text-purple-800 dark:text-purple-50 dark:border-purple-600' 'bg-purple-100 dark:bg-purple-500',
   'monolog' 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-50 dark:border-gray-600' 'bg-gray-100 dark:bg-gray-500',
   'inspector' 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-50 dark:border-gray-600' 'bg-gray-100 dark:bg-gray-500',
   'ray' 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-50 dark:border-gray-600' 'bg-gray-100 dark:bg-gray-500' */

  @each $map in $eventTypeColorsMap {
    $name: nth($map, 1);
    $color: nth($map, 2);

    &--#{$name} {
      @apply bg-#{$color}-50 dark:bg-#{$color}-700 text-#{$color}-800 dark:text-#{$color}-50 dark:border-#{$color}-600;

      &:hover {
        @apply bg-#{$color}-100 dark:bg-#{$color}-500;
      }
    }
  }
}

.preview-card-header__tag--json {
  @apply bg-blue-600 text-blue-50 border-blue-600;

  &:hover {
    @apply bg-blue-500 dark:bg-blue-500;
  }
}

.preview-card-header__buttons {
  @apply flex justify-end space-x-2;
}

.preview-card-header__buttons-expand {
  @apply relative left-[2px] flex border-x-2 rounded-3xl border-transparent dark:border-transparent cursor-pointer;

  &:hover {
    @apply bg-gray-200 dark:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-700 border-gray-200 dark:border-gray-700;
  }
}

.preview-card-header__buttons-expand-list {
  @apply flex flex-row justify-end space-x-2 pr-2 transition-all;
  @apply hidden overflow-hidden opacity-0;
  order: -1;

  .preview-card-header__buttons-expand:hover & {
    @apply flex overflow-visible opacity-100;
  }
}

.preview-card-header__button {
  @apply w-5 h-5 md:w-4 md:h-4 rounded-full opacity-90 hover:opacity-100 transition-all hover:ring-4 ring-offset-1;
  @apply text-white bg-gray-300 dark:bg-gray-600 ring-blue-200 dark:ring-blue-800;
}

.preview-card-header__button--copy {
  @apply text-gray-800 dark:text-white bg-transparent dark:bg-transparent;
}

.preview-card-header__button--collapse {
  &:hover {
    @apply text-white bg-gray-500;
  }
}

.preview-card-header__button--collapse-closed {
  @apply text-white bg-blue-700 ring-blue-300 dark:bg-blue-700 hover:bg-blue-700;
}

.preview-card-header__button--delete {
  @apply text-white dark:text-white bg-red-700 dark:bg-red-700 ring-red-200 dark:ring-red-800;

  &:disabled {
    @apply opacity-50 pointer-events-none;
  }
}

.preview-card-header__button--lock {
  @apply hover:bg-green-700 hover:dark:bg-green-700;
}

.preview-card-header__button--locked {
  @apply text-white dark:text-white bg-green-700 dark:bg-green-700 ring-2 ring-green-700 dark:ring-green-700 hover:bg-green-800 dark:hover:bg-green-500;
}

.preview-card-header__button-icon {
  @apply p-0.5 dark:fill-white;

  .preview-card-header__button--collapse & {
    @apply p-1;
  }

  .preview-card-header__button--delete & {
    @apply p-1;
  }
}
</style>
