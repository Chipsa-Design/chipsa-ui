import { FrameProps, Frame as IFrame } from './types';

export class Frame implements IFrame {
    private props: FrameProps;
    public idx: number;
    public img: HTMLImageElement;
    public status: 'idle' | 'loading' | 'loaded' | 'failed';

    constructor(props: FrameProps) {
        this.props = props;
        this.idx = props.idx;
        this.status = 'loading';
        this.img = new Image();

        this.img.addEventListener('load', this.onLoad, { once: true });
        this.img.addEventListener('error', this.onError, { once: true });
        this.img.src = props.src;
    }

    onLoad = () => {
        this.status = 'loaded';
        this.props.onLoad?.(this);
    };

    onError = () => {
        this.status = 'failed';
        this.props.onError?.(this);
    };

    destroy() {
        this.img.removeEventListener('load', this.onLoad);
        this.img.removeEventListener('error', this.onError);
    }
}
