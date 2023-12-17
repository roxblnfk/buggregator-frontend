import type { Meta, StoryObj } from "@storybook/vue3";
import type { ComponentProps } from "vue-component-type-helpers";
import { HTMLCode } from '~/src/shared/mocks'
import SmtpPagePreview from './smtp-page-preview.vue';

export default {
  title: "Screens/smtp/SmtpPagePreview",
  component: SmtpPagePreview,
  render: (args: ComponentProps<typeof SmtpPagePreview>) => ({
    components: { SmtpPagePreview },
    setup() {
      return {
        args,
      };
    },
    template: `<SmtpPagePreview v-bind="args">${HTMLCode}</SmtpPagePreview>`,
  })
} as Meta<typeof SmtpPagePreview>;


export const Default: StoryObj<typeof SmtpPagePreview> = {
  args: {}
};
export const Tablet = {
  args: {
    device: 'tablet',
  }
};

export const Mobile: StoryObj<typeof SmtpPagePreview> = {
  args: {
    device: 'mobile',
  }
};

export const Desktop: StoryObj<typeof SmtpPagePreview> = {
  args: {
    device: 'desktop',
  }
};
