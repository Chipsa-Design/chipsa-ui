import { Frame } from './Frame';
import { FramesIndexesList } from './FramesIndexesList';
import { FramesLoader, FramesLoaderInstantProps, Frame as IFrame } from './types';

export class FramesLoaderInstant implements FramesLoader {
    public loadedFrames = new FramesIndexesList();
    public frames: Frame[] = [];
    public stats = {
        processed: 0,
        loaded: 0,
        failed: 0,
    };

    constructor(public props: FramesLoaderInstantProps) {
        this.props = props;
        this.#loadFrames();
    }

    #loadFrames() {
        const onProcess = (frame: IFrame) => {
            this.props.onFrameProcess?.({ frame, stats: this.stats });

            const isFinished = this.stats.processed === this.props.framesCount;
            if (!isFinished) return;

            this.props.onReady?.();
            this.props.onFullyLoaded?.();
        };

        for (let i = 0; i < this.props.framesCount; i++) {
            const frame = new Frame({
                idx: i,
                src: this.props.getFrameUrl(i),
                onLoad: (frame) => {
                    this.stats.loaded += 1;
                    this.stats.processed += 1;
                    this.loadedFrames.insert(frame.idx);
                    this.props.onFrameLoad?.({ frame, stats: this.stats });
                    onProcess(frame);
                },
                onError: (frame) => {
                    this.stats.failed += 1;
                    this.stats.processed += 1;
                    this.props.onFrameError?.({ frame, stats: this.stats });
                    onProcess(frame);
                },
            });

            this.frames[i] = frame;
        }
    }

    destroy() {
        this.loadedFrames.destroy();
        this.frames.map((f) => f.destroy());
        this.frames = [];
        this.stats = { processed: 0, loaded: 0, failed: 0 };
    }
}
