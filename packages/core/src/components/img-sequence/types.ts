import { ObjectFit, ObjectPosition } from "./ObjectPlacement";

export type FrameProps = {
  idx: number;
  src: string;
  onLoad?: (f: Frame) => void;
  onError?: (f: Frame) => void;
};

export type FrameIdx = number;

export type Frame = {
  idx: FrameIdx;
  img: HTMLImageElement;
  status: "idle" | "loading" | "loaded" | "failed";
  destroy(): void;
  onLoad(): void;
  onError(): void;
};

export type ImgSequenceProps = {
  loader: FramesLoaderProps;
  canvas: HTMLCanvasElement | null;
  playback?: Partial<PlaybackOptions>;
  render?: Partial<RenderOptions>;
  debug?: boolean;
};

export type FramesLoadingStats = {
  processed: number;
  loaded: number;
  failed: number;
};

export type FrameLoadingData = {
  frame: Frame;
  stats: FramesLoadingStats;
};

export type FramesLoaderCtx = {
  canvas: HTMLCanvasElement;
  playbackOptions: PlaybackOptions;
};

export type FramesLoaderPropsBase = {
  framesCount: number;
  getFrameUrl: (idx: number) => string;
  onFrameProcess?: (data: FrameLoadingData) => void;
  onFrameLoad?: (data: FrameLoadingData) => void;
  onFrameError?: (data: FrameLoadingData) => void;
  onReady?: () => void;
  onFullyLoaded?: () => void;
};

export type FramesLoaderInstantProps = FramesLoaderPropsBase & {
  strategy: "instant";
};

export type FramesLoaderLazyProps = FramesLoaderPropsBase & {
  strategy: "lazy";
  framesLoadingRange: number;
};

export type FramesLoaderLODProps = FramesLoaderPropsBase & {
  strategy: "lod";
  level?: number;
};

export type FramesLoaderProps =
  | FramesLoaderInstantProps
  | FramesLoaderLazyProps
  | FramesLoaderLODProps;

export interface FramesLoader {
  stats: FramesLoadingStats;
  props: FramesLoaderProps;
  frames: Frame[];
  loadedFrames: FramesIndexesList;
  destroy(): void;
}

export type PlaybackOptions = {
  fps: number;
  loop: boolean;
  reverse: boolean;
  startFrameIdx: number;
  minFrameIdx: number;
  maxFrameIdx: number;
};

export type RenderOptions = {
  force?: boolean;
  fallbackToClosestFrame?: boolean;
  shouldClear?: boolean;
  objectFit?: ObjectFit;
  objectPosition?: ObjectPosition;
};

export interface FramesIndexesList {
  get(): FrameIdx[];
  getIdx(idx: FrameIdx): number;
  next(idx: FrameIdx, maxIdx?: FrameIdx): FrameIdx | null;
  prev(idx: FrameIdx, minIdx?: FrameIdx): FrameIdx | null;
  selfOrNext(idx: FrameIdx, maxIdx?: FrameIdx): FrameIdx | null;
  selfOrPrev(idx: FrameIdx, minIdx?: FrameIdx): FrameIdx | null;
  contains(idx: FrameIdx): boolean;
  closest(idx: FrameIdx): FrameIdx | null;
  head(): FrameIdx | null;
  tail(): FrameIdx | null;
  insert(idx: FrameIdx): number;
}
