import { FramesLoaderInstant } from './FramesLoaderInstant';
import { FramesLoaderLOD } from './FramesLoaderLOD';
import { FramesLoaderLazy } from './FramesLoaderLazy';
import { clamp } from './ImgSequence.utils';
import { ObjectPlacement } from './ObjectPlacement';
import { Frame, FramesLoader, ImgSequenceProps, PlaybackOptions, RenderOptions } from './types';

/**
 * A class to manage and render an image sequence on a canvas with customizable playback and rendering options.
 * @class
 * @see {@link https://gitlab.com/chipsadesign/img-sequence/-/blob/master/src/core/ImgSequence.ts}
 * @example
 * ```javascript
 * const sequence = new ImgSequence({
 *   canvas: document.getElementById('myCanvas'),
 *   loader: { strategy: 'instant', framesCount: 100, getFrameUrl: (idx) => `frame_${idx}.png` },
 *   playback: { fps: 30, loop: true },
 *   render: { objectFit: 'cover', objectPosition: ['center', 'center'] },
 *   debug: true
 * });
 * sequence.play();
 * ```
 */
export class ImgSequence {
    private props: ImgSequenceProps;
    private currentFrameIdx = 0;
    private lastRenderedFrame = -1;
    private playbackOptions: PlaybackOptions;
    private playbackAnimationFrameId: number | null = null;
    private playbackLastTimestamp: number = performance.now();
    private playbackEnabled: boolean = false;
    private canvas: HTMLCanvasElement | null = null;
    private context: CanvasRenderingContext2D | null = null;
    private loader: FramesLoader | null = null;
    private framePlacement = new ObjectPlacement();
    public framesCount = 0;

    /**
     * Creates an ImgSequence instance.
     * @param {Object} props - Configuration properties for the image sequence.
     * @param {Object} props.loader - Properties for the frames loader.
     * @param {HTMLCanvasElement | null} props.canvas - The canvas element to render on.
     * @param {Object} [props.playback] - Optional partial playback options.
     * @param {Object} [props.render] - Optional partial rendering options.
     * @param {boolean} [props.debug] - Optional flag to enable debug logging.
     */
    constructor(props: ImgSequenceProps) {
        this.props = props;
        this.framesCount = props.loader.framesCount;
        this.playbackOptions = {
            startFrameIdx: props.playback?.minFrameIdx ?? 0,
            minFrameIdx: 0,
            maxFrameIdx: this.framesCount - 1,
            fps: 24,
            loop: false,
            reverse: false,
            ...(props.playback || {}),
        };

        this.#initCanvas();
        this.#initLoader();
        this.#setFrame(this.playbackOptions.startFrameIdx);
        this.#bindEvents();
    }

    #initLoader() {
        if (!this.canvas) return;
        const loader = this.props.loader;
        const strategy = loader.strategy;
        const ctx = { canvas: this.canvas, playbackOptions: this.playbackOptions };
        const { onReady, onFullyLoaded } = loader;

        loader.onReady = () => (this.#onReady(), onReady?.());
        loader.onFullyLoaded = () => (this.#onFullyLoaded(), onFullyLoaded?.());

        if (strategy === 'instant') this.loader = new FramesLoaderInstant(loader);
        if (strategy === 'lazy') this.loader = new FramesLoaderLazy(loader, ctx);
        if (strategy === 'lod') this.loader = new FramesLoaderLOD(loader, ctx);
    }

    #initCanvas() {
        this.canvas = this.props.canvas;
        this.context = this.canvas?.getContext('2d') ?? null;
        this.#setCanvasDimensions();
    }

    #setCanvasDimensions() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.framePlacement.setContainer(this.canvas);
    }

    #setFrame(frameIdx: number | null): boolean {
        if (frameIdx === null) return false;

        this.currentFrameIdx = frameIdx;
        this.#onFrameChanged();
        return true;
    }

    #setFrameForPlayback(frameIdx: number | null): boolean {
        if (frameIdx === null) return false;

        const { minFrameIdx, maxFrameIdx } = this.playbackOptions;
        if (frameIdx < minFrameIdx || frameIdx > maxFrameIdx) {
            this.#log('info', 'Frame is out of bounds', {
                frameIdx,
                minFrameIdx,
                maxFrameIdx,
            });
            return false;
        }

        return this.#setFrame(frameIdx);
    }

    #updatePlayback() {
        if (!this.loader) return;
        const { minFrameIdx, maxFrameIdx, loop, reverse } = this.playbackOptions;
        const currentFrameIdx = this.currentFrameIdx;

        if (minFrameIdx >= maxFrameIdx) {
            this.#log('error', 'Invalid min/max frames settings');
            this.stop();
            return;
        }

        let nextIdx = reverse ? currentFrameIdx - 1 : currentFrameIdx + 1;
        if (this.#setFrameForPlayback(nextIdx)) {
            return;
        }

        if (!loop) {
            this.#log('info', 'No Loop');
            this.stop();
            return;
        }

        nextIdx = reverse ? maxFrameIdx : minFrameIdx;
        this.#setFrameForPlayback(nextIdx);
    }

    #startPlaybackLoop() {
        const tick = (timestamp: number) => {
            if (!this.playbackEnabled) return;
            this.playbackAnimationFrameId = requestAnimationFrame(tick);

            const frameDuration = 1000 / this.playbackOptions.fps;

            // Skip if timestep ms hasn't passed since last frame
            if (timestamp - this.playbackLastTimestamp < frameDuration) return;
            this.playbackLastTimestamp = timestamp;
            this.render();
            this.#updatePlayback();
        };

        this.playbackAnimationFrameId = requestAnimationFrame(tick);
    }

    /**
     * Stops the playback of the image sequence and cancels any ongoing animation.
     */
    stop() {
        if (this.playbackAnimationFrameId) {
            cancelAnimationFrame(this.playbackAnimationFrameId);
        }
        this.playbackEnabled = false;
        this.playbackAnimationFrameId = null;
        this.#onStop();
    }

    /**
     * Starts playback of the image sequence with customizable options.
     * @param {Object} options - Optional playback settings to override defaults.
     * @param {number} [options.fps=24] - Frames per second.
     * @param {boolean} [options.loop=false] - Whether to loop the playback.
     * @param {boolean} [options.reverse=false] - Whether to play in reverse.
     * @param {number} [options.startFrameIdx=0] - Starting frame index (clamped between 0 and framesCount-1).
     * @param {number} [options.maxFrameIdx] - Maximum frame index for playback (clamped between 0 and framesCount-1).
     * @param {number} [options.minFrameIdx=0] - Minimum frame index for playback (clamped between 0 and framesCount-1).
     * @example
     * ```javascript
     * sequence.play({ fps: 30, loop: true, startFrameIdx: 10 });
     * ```
     */
    play(options: Partial<PlaybackOptions> = {}) {
        const { minFrameIdx, maxFrameIdx, startFrameIdx } = options;

        if (minFrameIdx !== undefined) {
            options.minFrameIdx = clamp(0, this.framesCount - 1, minFrameIdx);
        }

        if (maxFrameIdx !== undefined) {
            options.maxFrameIdx = clamp(0, this.framesCount - 1, maxFrameIdx);
        }

        if (startFrameIdx !== undefined) {
            options.startFrameIdx = clamp(0, this.framesCount - 1, startFrameIdx);
            this.#setFrameForPlayback(options.startFrameIdx);
        }

        this.playbackOptions = { ...this.playbackOptions, ...options };
        this.playbackEnabled = true;
        this.#startPlaybackLoop();
        this.#onPlay();
    }

    /**
     * Plays the sequence to a specific progress point within the frame range.
     * @param {number} rawProgress - A value between 0 and 1 representing the progress through the sequence (clamped to 0-1).
     */
    playToProgress(rawProgress: number) {
        const progress = clamp(0, 1, rawProgress);
        const min = this.playbackOptions.minFrameIdx;
        const max = this.playbackOptions.maxFrameIdx;
        const frameIdx = Math.round(progress * (max - min) + min);
        if (frameIdx === this.currentFrameIdx) return;

        const reverse = frameIdx < this.currentFrameIdx;
        const maxFrameIdx = reverse ? this.currentFrameIdx : frameIdx;
        const minFrameIdx = reverse ? frameIdx : this.currentFrameIdx;
        this.play({
            maxFrameIdx,
            minFrameIdx,
            reverse,
            loop: false,
        });
    }

    #getFrameToRender(fallbackToClosestFrame: boolean = false): Frame | null {
        if (!this.loader) return null;

        let frame = this.loader.frames[this.currentFrameIdx];
        if (frame?.status === 'loaded') return frame;

        if (!fallbackToClosestFrame) return null;

        const closestIdx = this.loader.loadedFrames.closest(this.currentFrameIdx);
        if (closestIdx === null) return null;

        frame = this.loader.frames[closestIdx];
        if (frame?.status === 'loaded') return frame;

        return null;
    }

    /**
     * Renders the current frame or a fallback frame to the canvas.
     * @param {Object} [options] - Optional rendering settings.
     * @param {boolean} [options.force=false] - Force re-rendering even if frame hasn't changed.
     * @param {boolean} [options.fallbackToClosestFrame=false] - Use the closest loaded frame if current is not loaded. Not recommended to use if loader strategy is lod.
     * @param {boolean} [options.shouldClear=false] - Clear the rendering area before drawing.
     * @param {string} [options.objectFit="contain"] - How the image fits in the container ("fill", "contain", "cover", "none", "scale-down").
     * @param {string | [string,string]} [options.objectPosition=["center"]] - Position of the image within the container (e.g., ["center"], ["top", "left"]).
     */
    render(options?: Partial<RenderOptions>) {
        if (!this.canvas || !this.context || !this.loader) {
            this.#log('error', 'Missing required objects');
            return;
        }

        options = Object.assign({}, this.props.render, options);
        const force = options?.force ?? false;
        const fallbackToClosestFrame = options.fallbackToClosestFrame ?? false;

        if (this.currentFrameIdx === this.lastRenderedFrame && !force) {
            this.#log('info', 'Nothing new to render');
            return;
        }

        const frame = this.#getFrameToRender(fallbackToClosestFrame);
        if (!frame) {
            this.#log('info', 'Frame to render is missing');
            return;
        }

        const { x, y, width, height } = this.framePlacement.calc({
            object: frame.img,
            fit: options.objectFit ?? 'contain',
            position: options.objectPosition ?? ['center'],
        });

        if (x == null || y == null) {
            this.#log('error', 'Unsupported position values');
            return;
        }

        if (options?.shouldClear) {
            this.context.clearRect(x, y, width, height);
        }

        this.context.drawImage(frame.img, x, y, width, height);
        this.lastRenderedFrame = this.currentFrameIdx;
    }

    /**
     * Renders a frame by its index.
     * @param {number} frameIdx - The index of the frame to set and render.
     */
    renderByFrameIdx(frameIdx: number) {
        if (this.#setFrame(frameIdx)) {
            this.render();
        }
    }

    /**
     * Renders a frame based on a progress value.
     * @param {number} rawProgress - A value between 0 and 1 representing the progress through the sequence (clamped to 0-1).
     */
    renderByProgress(rawProgress: number) {
        const progress = clamp(0, 1, rawProgress);
        const frameIdx = Math.round(progress * (this.framesCount - 1));
        this.renderByFrameIdx(frameIdx);
    }

    #onResize = () => {
        this.#setCanvasDimensions();
        this.render({ force: true });
    };

    #onReady() {
        this.render({ force: true, fallbackToClosestFrame: true });
        this.canvas?.dispatchEvent(
            new CustomEvent('ready', {
                detail: { idx: this.currentFrameIdx },
            }),
        );
    }

    #onStop() {
        this.canvas?.dispatchEvent(
            new CustomEvent('stop', {
                detail: { idx: this.currentFrameIdx },
            }),
        );
    }

    #onPlay() {
        this.canvas?.dispatchEvent(
            new CustomEvent('play', {
                detail: { idx: this.currentFrameIdx },
            }),
        );
    }

    #onFullyLoaded() {
        this.canvas?.dispatchEvent(
            new CustomEvent('fully-loaded', {
                detail: { idx: this.currentFrameIdx },
            }),
        );
    }

    #onFrameChanged() {
        this.canvas?.dispatchEvent(
            new CustomEvent('frame-changed', {
                detail: { idx: this.currentFrameIdx },
            }),
        );
    }

    #bindEvents() {
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', this.#onResize);
        }
    }

    #unbindEvents() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.#onResize);
        }
    }

    /**
     * Cleans up resources by stopping playback, unbinding events, and destroying the loader.
     */
    destroy() {
        this.stop();
        this.#unbindEvents();
        this.loader?.destroy();
        this.canvas = null;
        this.context = null;
    }

    #log(type: 'info' | 'error', msg: string, ...rest: unknown[]) {
        if (!this.props.debug) return;
        const prefix = '[ImgSequence] ';
        console[type](prefix + msg, ...rest);
    }
}
