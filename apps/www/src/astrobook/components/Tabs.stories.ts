import type { ComponentProps } from 'astro/types';
import Center from '../decorators/Center.astro';
import TabsExample from './TabsExample.astro';

type TabsExampleProps = ComponentProps<typeof TabsExample>;

export default {
    component: TabsExample,
};

export const Default = {
    args: {
        id: 'tabs-default',
    } satisfies TabsExampleProps,
    decorators: [{ component: Center }],
};

