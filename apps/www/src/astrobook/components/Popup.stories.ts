import Popup from '@astro/components/Popup/Popup.astro';
import type { ComponentProps } from 'astro/types';
import Center from '@/astrobook/decorators/Center.astro';

type PopupProps = ComponentProps<typeof Popup>;

export default {
    component: Popup,
};

export const Default = {
    args: {
        id: 'popup-default',
    } satisfies PopupProps,
    decorators: [{ component: Center }],
};
