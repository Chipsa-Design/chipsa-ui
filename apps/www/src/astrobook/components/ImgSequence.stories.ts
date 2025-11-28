import ImgSequence from '@astro/components/img-sequence/ImgSequence.astro';
import Center from '@astrobook/decorators/Center.astro';
import type { ComponentProps } from 'astro/types';

type ImgSequenceProps = ComponentProps<typeof ImgSequence>;

export default {
    component: ImgSequence,
};

export const Default = {
    args: {} satisfies ImgSequenceProps,
    decorators: [{ component: Center }],
};
