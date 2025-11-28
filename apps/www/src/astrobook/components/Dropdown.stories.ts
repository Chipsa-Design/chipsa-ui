import Dropdown from '@astro/components/dropdown/Dropdown.astro';
import Center from '@astrobook/decorators/Center.astro';
import type { ComponentProps } from 'astro/types';

type DropdownProps = ComponentProps<typeof Dropdown>;

export default {
    component: Dropdown,
};

export const Default = {
    args: {
        position: 'bottom-center',
    } satisfies DropdownProps,
    decorators: [{ component: Center }],
};

