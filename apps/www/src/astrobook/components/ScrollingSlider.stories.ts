import type { ComponentProps } from 'astro/types';
import Center from '@astrobook/decorators/Center.astro';
import ScrollingSliderExample from './ScrollingSliderExample.astro';

type ScrollingSliderExampleProps = ComponentProps<typeof ScrollingSliderExample>;

export default {
    component: ScrollingSliderExample,
};

export const Default = {
    args: {} satisfies ScrollingSliderExampleProps,
    decorators: [{ component: Center }],
};

