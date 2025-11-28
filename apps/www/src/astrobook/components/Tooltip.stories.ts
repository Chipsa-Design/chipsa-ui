import Tooltip from '@astro/components/Tooltip/Tooltip.astro';
import Center from '@astrobook/decorators/Center.astro';
import type { ComponentProps } from 'astro/types';

type TooltipProps = ComponentProps<typeof Tooltip>;

export default {
    component: Tooltip,
};

export const Default = {
    args: {} satisfies TooltipProps,
    decorators: [{ component: Center }],
};

