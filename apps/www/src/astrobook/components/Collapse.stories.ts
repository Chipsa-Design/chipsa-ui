import Collapse from '@astro/Collapse/Collapse.astro';
import Center from '@astrobook/decorators/Center.astro';
import type { ComponentProps } from 'astro/types';

type CollapseProps = ComponentProps<typeof Collapse>;

export default {
    component: Collapse,
};

export const Default = {
    args: {} satisfies CollapseProps,
    decorators: [{ component: Center }],
};
