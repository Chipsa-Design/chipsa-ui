import { ImgSequence, ImgSequenceProps } from '@chipsa-ui/core';
import { useEffect, useState } from 'react';

export const useImgSequence = (options: ImgSequenceProps) => {
    const [instance, setInstance] = useState<ImgSequence | null>();

    useEffect(() => {
        setInstance(new ImgSequence(options));
    }, []);

    return instance;
};
