import type { ComponentProps } from 'astro/types';
import Center from '@astrobook/decorators/Center.astro';
import MarqueeExample from './MarqueeExample.astro';

type MarqueeExampleProps = ComponentProps<typeof MarqueeExample>;

export default {
    component: MarqueeExample,
};

export const Default = {
    args: {
        items: [1, 2, 3, 4, 5],
    } satisfies MarqueeExampleProps,
    decorators: [{ component: Center }],
};

