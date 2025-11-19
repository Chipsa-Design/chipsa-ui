import ImgSequence from '@astro/components/img-sequence/ImgSequence.astro';
import type { ComponentProps } from 'astro/types';
import Center from '@/astrobook/decorators/Center.astro';

type ImgSequenceProps = ComponentProps<typeof ImgSequence>;

export default {
    component: ImgSequence,
};

export const Default = {
    args: {} satisfies ImgSequenceProps,
    decorators: [{ component: Center }],
};
