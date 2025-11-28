import type { ComponentProps } from 'astro/types';
import Center from '../decorators/Center.astro';
import PopupExample from './PopupExample.astro';

type PopupExampleProps = ComponentProps<typeof PopupExample>;

export default {
    component: PopupExample,
};

export const Default = {
    args: {
        id: 'popup-default',
    } satisfies PopupExampleProps,
    decorators: [{ component: Center }],
};
