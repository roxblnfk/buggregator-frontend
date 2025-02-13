import type { Meta, Story } from "@storybook/vue3";
import { useProfiler } from "../../lib";
import { profilerMock } from  "../../mocks";
import PreviewCard from './preview-card.vue';

const { normalizeProfilerEvent } = useProfiler();

export default {
  title: "Entities/profiler/PreviewCard",
  component: PreviewCard
} as Meta<typeof PreviewCard>;

const Template: Story = (args) => ({
  components: { PreviewCard },
  setup() {
    return {
      args,
    };
  },
  template: `<PreviewCard v-bind="args" />`,
});

export const Event = Template.bind({});

Event.args = {
  event: normalizeProfilerEvent(profilerMock),
};
