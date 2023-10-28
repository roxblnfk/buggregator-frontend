import { Meta, Story } from "@storybook/vue3";
import CustomPayload from '~/components/RayDumpPreview/RayTypesPreview/CustomPayload.vue';
import { normalizeRayDumpEvent } from "~/utils/normalize-event";
import { rayTextMock } from '~/src/entities/ray/mocks'

export default {
  title: "RayDump/Types/Custom",
  component: CustomPayload
} as Meta<typeof CustomPayload>;

const Template: Story = (args) => ({
  components: { CustomPayload },
  setup() {
    return {
      args,
    };
  },
  template: `<CustomPayload v-bind="args" />`,
});

export const Custom = Template.bind({});
Custom.args = {payload: normalizeRayDumpEvent(rayTextMock).payload.payload.payloads[0]};
