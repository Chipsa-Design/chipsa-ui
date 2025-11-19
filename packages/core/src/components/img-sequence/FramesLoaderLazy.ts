import { Frame } from './Frame';
import { FramesIndexesList } from './FramesIndexesList';
import { FramesLoader, FramesLoaderCtx, FramesLoaderLazyProps, Frame as IFrame } from './types';

export class FramesLoaderLazy implements FramesLoader {
    public loadedFrames = new FramesIndexesList();
    public props: FramesLoaderLazyProps;
    public frames: Frame[] = [];
    public stats = {
        processed: 0,
        loaded: 0,
        failed: 0,
    };

    private ctx: FramesLoaderCtx;

    constructor(props: FramesLoaderLazyProps, ctx: FramesLoaderCtx) {
        this.props = props;
        this.ctx = ctx;

        this.#bindEvents();
        this.#loadFramesRange(this.ctx.playbackOptions.startFrameIdx, () => {
            this.props.onReady?.();
        });
    }

    #loadFramesRange(idx: number, onFinish?: () => void) {
        const range = this.props.framesLoadingRange;
        const total = this.props.framesCount;
        const min = this.ctx.playbackOptions.minFrameIdx;
        const max = this.ctx.playbackOptions.maxFrameIdx;
        const rangedIdxs = getRangedBoundedIndexes(idx, { total, range, min, max });
        const rangeTotal = rangedIdxs.length;
        let processedInRange = 0;

        const onFrameProcess = (frame: IFrame) => {
            processedInRange += 1;
            this.props.onFrameProcess?.({ frame, stats: this.stats });

            const isFullyLoaded = this.stats.processed === this.props.framesCount;
            if (isFullyLoaded) this.props.onFullyLoaded?.();

            const isRangeFinished = rangeTotal === processedInRange;
            if (!isRangeFinished) return;

            onFinish?.();
        };

        for (let i = 0; i < rangeTotal; i++) {
            this.#loadFrame(rangedIdxs[i], onFrameProcess);
        }
    }

    #loadFrame(idx: number, onProcess: (frame: IFrame) => void) {
        if (idx < 0 && idx >= this.props.framesCount) return;

        const existing = this.frames[idx];
        if (existing) {
            onProcess?.(existing);
            return;
        }

        this.frames[idx] = new Frame({
            idx,
            src: this.props.getFrameUrl(idx),
            onLoad: (frame) => {
                this.stats.loaded += 1;
                this.stats.processed += 1;
                this.loadedFrames.insert(frame.idx);
                this.props.onFrameLoad?.({ frame, stats: this.stats });
                onProcess?.(frame);
            },
            onError: (frame) => {
                this.stats.failed += 1;
                this.stats.processed += 1;
                this.props.onFrameError?.({ frame, stats: this.stats });
                onProcess?.(frame);
            },
        });
    }

    #onFrameChanged = (evt: Event) => {
        const detail = (evt as CustomEvent).detail;
        const idx = detail.idx;
        this.#loadFramesRange(idx);
    };

    #bindEvents() {
        this.ctx.canvas.addEventListener('frame-changed', this.#onFrameChanged);
    }

    #unbindEvents() {
        this.ctx.canvas.removeEventListener('frame-changed', this.#onFrameChanged);
    }

    destroy() {
        this.#unbindEvents();
        this.loadedFrames.destroy();
        this.frames.map((f) => f.destroy());
        this.frames = [];
        this.stats = { processed: 0, loaded: 0, failed: 0 };
    }
}
export function getRangedBoundedIndexes(
    start: number,
    options: { range: number; total: number; min: number; max: number },
) {
    const { range, total, min, max } = options;
    const result = [start];
    let left = start - 1;
    let right = start + 1;

    for (let i = 0; i < range; i++) {
        if (right <= max) {
            result.push(right);
            right++;
        } else {
            result.push(min + (right - max - 1));
            right++;
        }

        if (left >= min) {
            result.push(left);
            left--;
        } else {
            result.push(max - (min - left - 1));
            left--;
        }
    }

    return result;
}
