import { Meta, Story } from "@storybook/vue3";
import CarbonPayload from '~/components/RayDumpPreview/RayTypesPreview/CarbonPayload.vue';
import { normalizeRayDumpEvent } from "~/utils/normalize-event";
import { rayCarbonMock } from '~/src/entities/ray/mocks'

export default {
  title: "RayDump/Types/Carbon",
  component: CarbonPayload
} as Meta<typeof CarbonPayload>;

const Template: Story = (args) => ({
  components: { CarbonPayload },
  setup() {
    return {
      args,
    };
  },
  template: `<CarbonPayload v-bind="args" />`,
});

export const Carbon = Template.bind({});
Carbon.args = {payload: normalizeRayDumpEvent(rayCarbonMock).payload.payload.payloads[0]};
