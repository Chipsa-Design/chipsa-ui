import { ImgSequence as ImgSequenceImpl, ImgSequenceProps as ImgSequenceImplProps } from '@chipsa-ui/core';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';

export type ImgSequenceProps = React.HTMLAttributes<HTMLElement> & {
    ref?: React.Ref<ImgSequenceHandle>;
    options: Omit<ImgSequenceImplProps, 'canvas'>;
};

export interface ImgSequenceHandle {
    instance: ImgSequenceImpl | null;
    canvas: React.RefObject<HTMLCanvasElement | null>;
}

export const ImgSequence = ({ ref, options, ...props }: ImgSequenceProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [instance, setInstance] = useState<ImgSequenceImpl | null>(null);

    useImperativeHandle(ref, () => ({
        instance,
        canvas: canvasRef,
    }));

    useEffect(() => {
        if (!canvasRef.current) return;

        const imgSequence = new ImgSequenceImpl({
            ...options,
            canvas: canvasRef.current,
        });

        setInstance(imgSequence);

        return () => {
            imgSequence.destroy();
            setInstance(null);
        };
    }, [options]);

    return <canvas {...props} ref={canvasRef}  />;
};
