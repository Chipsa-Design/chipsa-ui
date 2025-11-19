import type { ComponentProps } from 'astro/types';
import Center from '../../../../../apps/www/src/astrobook/decorators/Center.astro';
import ImgSequence from './ImgSequence.astro';

type ImgSequenceProps = ComponentProps<typeof ImgSequence>;

export default {
    component: ImgSequence,
};

export const Default = {
    args: {} satisfies ImgSequenceProps,
    decorators: [{ component: Center }],
};
