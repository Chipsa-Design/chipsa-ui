import { Frame } from "./Frame";
import { FramesIndexesList } from "./FramesIndexesList";
import {
  FramesLoader,
  FramesLoaderCtx,
  FramesLoaderLODProps,
  Frame as IFrame,
} from "./types";

export class FramesLoaderLOD implements FramesLoader {
  public loadedFrames = new FramesIndexesList();
  public props: FramesLoaderLODProps;
  public frames: Frame[] = [];
  public stats = {
    processed: 0,
    loaded: 0,
    failed: 0,
  };

  constructor(props: FramesLoaderLODProps, ctx: FramesLoaderCtx) {
    this.props = props;

    if (this.props.level !== undefined && this.props.level < 1) {
      this.props.level = undefined;
    }

    this.#loadFrame(ctx.playbackOptions.startFrameIdx);
    this.#loadFrames();
  }

  #loadFrame(idx: number, onProcessed?: (frame: IFrame) => void) {
    const existing = this.frames[idx];

    if (existing) {
      this.props.onFrameProcess?.({ frame: existing, stats: this.stats });
      onProcessed?.(existing);
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
        this.props.onFrameProcess?.({ frame, stats: this.stats });
        onProcessed?.(frame);
      },
      onError: (frame) => {
        this.stats.failed += 1;
        this.stats.processed += 1;
        this.props.onFrameError?.({ frame, stats: this.stats });
        this.props.onFrameProcess?.({ frame, stats: this.stats });
        onProcessed?.(frame);
      },
    });
  }

  #loadFrames() {
    const indices = Array.from({ length: this.props.framesCount }, (_, i) => i);
    const initialLevel = this.props.level ?? this.props.framesCount - 1;
    levelOfDetail(indices, initialLevel, ({ subset, level }) => {
      return new Promise<null>((resolve) => {
        let subsetFramesProcessed = 0;
        const subsetFramesCount = subset.length;

        const onProcessed = () => {
          subsetFramesProcessed += 1;
          const isSubsetFinished = subsetFramesProcessed === subsetFramesCount;
          const isFirstSubset = level === initialLevel;
          const isFullyLoaded = this.stats.processed === this.props.framesCount;

          if (!isSubsetFinished) return;
          if (isFirstSubset) this.props.onReady?.();
          if (isFullyLoaded) this.props.onFullyLoaded?.();
          resolve(null);
        };

        subset.forEach((idx) => this.#loadFrame(idx, onProcessed));
      });
    });
  }

  destroy() {
    this.frames.forEach((frame) => frame.destroy());
    this.loadedFrames.destroy();
    this.frames = [];
    this.stats = { processed: 0, loaded: 0, failed: 0 };
  }
}

export async function levelOfDetail<T extends any>(
  arr: T[],
  level: number,
  callback: (data: { level: number; subset: T[] }) => Promise<unknown>
) {
  let currentLevel = Math.max(1, Math.round(level));

  while (currentLevel >= 1) {
    const subset: T[] = [];

    if (arr.length > 0) {
      subset.push(arr[0]);
    }

    for (let i = currentLevel; i < arr.length; i += currentLevel) {
      subset.push(arr[i]);
    }

    await callback({ level: currentLevel, subset });

    currentLevel = Math.floor(currentLevel / 2);
  }
}

/* eslint-disable sonarjs/no-commented-code */
// Not sure if this is a feature, but the function treats the level as the maximum step size, (instead of the exact level)
// recalculating the actual step based on the level and frame count, resulting in smoother
// frame processing across the entire sequence.
// export async function levelOfDetail<T extends any>(
//     arr: T[],
//     level: number,
//     callback: (data: { level: number; subset: T[] }) => Promise<unknown>,
// ) {
//     let currentLevel = level;

//     while (currentLevel >= 1) {
//         const subset: T[] = [];
//         const numPoints = Math.min(Math.floor(arr.length / currentLevel) + 1, arr.length);
//         const step = numPoints > 1 ? (arr.length - 1) / (numPoints - 1) : 0;

//         for (let i = 0; i < numPoints; i++) {
//             const index = Math.round(i * step);
//             if (index < arr.length) {
//                 subset.push(arr[index]);
//             }
//         }

//         await callback({ level: currentLevel, subset });

//         currentLevel = Math.floor(currentLevel / 2);
//     }
// }
