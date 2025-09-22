import { binaryClosest, binaryInsert } from "./ImgSequence.utils";
import { FrameIdx, FramesIndexesList as IFramesIndexesList } from "./types";

export class FramesIndexesList implements IFramesIndexesList {
  private list: FrameIdx[] = [];
  private listIdxMap: Map<FrameIdx, number> = new Map();

  constructor(initial: FrameIdx[] = []) {
    this.list = [...initial];
    this.remapIndexes(0);
  }

  get() {
    return this.list;
  }

  getIdx(idx: FrameIdx) {
    return this.listIdxMap.get(idx) ?? -1;
  }

  remapIndexes(insertedAt: number) {
    for (let i = insertedAt; i < this.list.length; i++) {
      this.listIdxMap.set(this.list[i], i);
    }
  }

  insert(idx: FrameIdx) {
    const insertedAt = binaryInsert(idx, this.list);
    this.listIdxMap.set(idx, insertedAt);
    this.remapIndexes(insertedAt);
    return insertedAt;
  }

  contains(idx: FrameIdx) {
    const val = this.listIdxMap.get(idx);
    return val !== undefined;
  }

  next(idx: FrameIdx, maxIdx: FrameIdx = Infinity) {
    const framIdxIdx = this.listIdxMap.get(idx);
    if (framIdxIdx === undefined) return null;

    const value = this.list[framIdxIdx + 1];
    if (value === undefined || value > maxIdx) return null;
    return value;
  }

  prev(idx: FrameIdx, minIdx: FrameIdx = -Infinity) {
    const framIdxIdx = this.listIdxMap.get(idx);
    if (framIdxIdx === undefined) return null;

    const value = this.list[framIdxIdx - 1];
    if (value === undefined || value < minIdx) return null;
    return value;
  }

  closest(idx: FrameIdx) {
    return binaryClosest(idx, this.get());
  }

  selfOrNext(idx: FrameIdx, maxIdx?: FrameIdx) {
    if (this.contains(idx)) return idx;
    return this.next(idx, maxIdx);
  }

  selfOrPrev(idx: FrameIdx, minIdx?: FrameIdx) {
    if (this.contains(idx)) return idx;
    return this.prev(idx, minIdx);
  }

  head(): FrameIdx | null {
    return this.list[0] ?? null;
  }

  tail(): FrameIdx | null {
    return this.list.at(-1) ?? null;
  }

  destroy() {
    this.list = [];
    this.listIdxMap.clear();
  }
}
