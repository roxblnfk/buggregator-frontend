<script lang="ts" setup generic="T">
// TODO: move useNuxtApp to composition api
import download from "downloadjs";
import { toBlob, toPng } from "html-to-image";
import debounce from "lodash.debounce";
import moment from "moment";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useFetch, useNuxtApp } from "#app"; // eslint-disable-line @conarti/feature-sliced/layers-slices
import { REST_API_URL } from "../../lib/io";
import type { NormalizedEvent } from "../../types";
import PreviewCardFooter from "./preview-card-footer.vue";
import PreviewCardHeader from "./preview-card-header.vue";
import { DownloadType } from "./types";

type Props = {
  event: NormalizedEvent<T>;
};

const props = defineProps<Props>();

const {
  $lockedIds: { items },
} = useNuxtApp();

const isCollapsed = ref(false);
const isLocked = ref((items || []).value.includes(props.event.id));
const isOptimized = ref(false);
const isVisibleControls = ref(true);

const eventRef = ref(null);

const normalizedTags = computed(() => [
  moment(props.event.date).format("HH:mm:ss"),
  ...props.event.labels,
]);

const normalizedOrigin = computed(() => {
  const originEntriesList = Object.entries(props.event.origin || {})
    .map(([key, value]) => [key, String(value)])
    .filter(([_, value]) => Boolean(value));

  return originEntriesList.length > 0
    ? Object.fromEntries(originEntriesList)
    : null;
});

const eventUrl = computed(() => `${REST_API_URL}/api/event/${props.event.id}`);

const toggleView = () => {
  isCollapsed.value = !isCollapsed.value;
};

const changeVisibleControls = (value = true) => {
  isVisibleControls.value = value;
};

const deleteEvent = () => {
  const { $events } = useNuxtApp();

  return $events?.removeById(props.event.id);
};

const toggleEventLock = () => {
  const { $lockedIds } = useNuxtApp();

  if (($lockedIds?.items.value || []).includes(props.event.id)) {
    $lockedIds?.remove(props.event.id);

    isLocked.value = false;
  } else {
    $lockedIds?.add(props.event.id);

    isLocked.value = true;
  }
};

const downloadImage = () => {
  changeVisibleControls(false);

  if (eventRef.value) {
    toPng(eventRef.value as HTMLInputElement)
      .then((dataUrl) => {
        download(dataUrl, `${props.event.type}-${props.event.id}.png`);
      })
      .catch((e) => console.error(e))
      .finally(() => {
        changeVisibleControls(true);
      });
  }
};

const downloadFile = async () => {
  const { $events } = useNuxtApp();

  if ($events) {
    try {
      const { data } = await useFetch($events.getUrl(props.event.id));

      if (data.value) {
        download(
          JSON.stringify(data.value, null, 2),
          `${props.event.type}-${props.event.id}.json`,
          "application/json"
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
};

const downloadEvent = (type: DownloadType) => {
  if (type === DownloadType.Image) {
    downloadImage();
  } else {
    downloadFile();
  }
};

const copyCode = () => {
  changeVisibleControls(false);

  if (eventRef.value) {
    // TODO: fix console error on copy
    toBlob(eventRef.value as HTMLElement)
      .then((blob) => {
        if (blob) {
          navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => {
        changeVisibleControls(true);
      });
  }
};

const optimiseRenderHidden = debounce(() => {
  if (eventRef.value) {
    const eventNode = eventRef.value as HTMLElement;
    const { top, height } = eventNode.getBoundingClientRect();

    const extraDelta = height;
    const isVisible =
      top - extraDelta <= window.innerHeight &&
      top + height + extraDelta * 2 >= 0;

    if (!isVisible && !isOptimized.value) {
      isOptimized.value = true;
      eventNode.style.height = `${eventNode.clientHeight}px`;
    } else if (isVisible && isOptimized.value) {
      isOptimized.value = false;
      eventNode.style.height = "auto";
    }
  }
}, 30);

onMounted(() => {
  window.addEventListener("scroll", optimiseRenderHidden);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", optimiseRenderHidden);
});
</script>

<template>
  <div
    :id="event.id"
    ref="eventRef"
    class="preview-card"
    :class="{ 'preview-card--collapsed': isCollapsed }"
  >
    <PreviewCardHeader
      class="preview-card__header"
      :event-url="eventUrl"
      :event-type="event.type"
      :event-id="event.id"
      :tags="normalizedTags"
      :is-open="!isCollapsed && !isOptimized"
      :is-locked="isLocked"
      :is-visible-controls="isVisibleControls && !isOptimized"
      @toggle-view="toggleView"
      @delete="deleteEvent"
      @copy="copyCode"
      @download="downloadEvent"
      @lock="toggleEventLock"
    />

    <div
      v-if="!isCollapsed && !isOptimized"
      ref="event_body"
      class="preview-card__body"
    >
      <slot />
    </div>

    <PreviewCardFooter
      v-if="
        !isCollapsed && !isOptimized && (normalizedOrigin || event.serverName)
      "
      class="preview-card__footer"
      :server-name="event.serverName"
      :origin-config="normalizedOrigin"
    />
  </div>
</template>

<style lang="scss" scoped>
.preview-card {
  @apply flex-grow flex flex-col p-3 lg:p-5 transition-colors dark:bg-gray-700;

  &:hover {
    @apply md:bg-gray-50 dark:bg-gray-900;
  }
}

.preview-card--collapsed {
  @apply shadow-bottom;
}

.preview-card__header {
  @apply w-full flex justify-between;
}

.preview-card__body {
  @apply flex flex-col mt-3;
}

.preview-card__footer {
  @apply w-full flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 text-xs text-gray-400;
}
</style>
