<script lang="ts" setup>
import moment from "moment";
import { defineProps, computed } from "vue";
import type { InspectorTransaction } from "../../types";

type Props = {
  transaction: InspectorTransaction;
};

const props = defineProps<Props>();

const processDate = computed(() =>
  moment(props.transaction.timestamp).toLocaleString()
);
const processResult = computed(() =>
  (props.transaction.result || "success").toUpperCase()
);
</script>

<template>
  <section class="inspector-stat-board">
    <div class="inspector-stat-board__item">
      <h4 class="inspector-stat-board__item-name">Timestamp</h4>
      <strong class="inspector-stat-board__item-value">
        {{ processDate }}
      </strong>
    </div>

    <div class="inspector-stat-board__item">
      <h4 class="inspector-stat-board__item-name">Duration</h4>
      <strong class="inspector-stat-board__item-value">
        {{ transaction.duration }} ms
      </strong>
    </div>

    <div class="inspector-stat-board__item">
      <h4 class="inspector-stat-board__item-name">Result</h4>
      <span class="inspector-stat-board__item-value">{{ processResult }}</span>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.inspector-stat-board {
  @apply bg-gray-200 dark:bg-gray-800 pt-5 pb-4 px-4 md:px-5 flex flex-col sm:flex-row justify-between items-start divide-y sm:divide-y-0 sm:divide-x divide-gray-300 dark:divide-gray-500;
}

.inspector-stat-board__item {
  @apply flex-auto pb-5 sm:pb-0 sm:px-10 pt-5 sm:pt-0;

  &:first-child {
    @apply sm:px-0;
  }
}

.inspector-stat-board__item-name {
  @apply text-gray-600 dark:text-gray-300 font-bold text-2xs mb-1 uppercase truncate;
}

.inspector-stat-board__item-value {
  @apply text-2xs sm:text-xs md:text-base truncate dark:text-white;
}
</style>
