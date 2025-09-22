import { describe, it } from "node:test";
import assert from "node:assert";

import { FramesIndexesList } from "./FramesIndexesList";

describe("FramesIndexesList", () => {
  it("Should insert indexes correctly", () => {
    const list = new FramesIndexesList([0, 16]);

    let idx = list.insert(8);
    assert.equal(idx, 1);

    idx = list.insert(32);
    assert.equal(idx, 3);

    idx = list.insert(3);
    assert.equal(idx, 1);

    assert.deepEqual(list.get(), [0, 3, 8, 16, 32]);
  });

  it("Should get next index correctly", () => {
    const list = new FramesIndexesList([0, 3, 8, 16, 32]);
    assert.equal(list.next(16), 32);
    assert.equal(list.next(32), null);
  });

  it("Should get next index with max value correctly", () => {
    const list = new FramesIndexesList([0, 3, 8, 16, 32]);
    const max = 16;
    assert.equal(list.next(3, max), 8);
    assert.equal(list.next(16, max), null);
    assert.equal(list.next(32, max), null);
  });

  it("Should get prev index correctly", () => {
    const list = new FramesIndexesList([0, 3, 8, 16, 32]);
    assert.equal(list.prev(16), 8);
    assert.equal(list.prev(0), null);
  });

  it("Should get prev index with min value correctly", () => {
    const list = new FramesIndexesList([0, 3, 8, 16, 32]);
    const min = 8;
    assert.equal(list.prev(16, min), 8);
    assert.equal(list.prev(8, min), null);
    assert.equal(list.prev(3, min), null);
  });

  it("Should detect if index is included in list", () => {
    const list = new FramesIndexesList([0, 3, 8, 16, 32]);
    assert.equal(list.contains(16), true);
    assert.equal(list.contains(7), false);
  });

  it("Should get head index correctly", () => {
    const list = new FramesIndexesList();
    assert.equal(list.head(), null);

    list.insert(3);
    assert.equal(list.head(), 3);

    list.insert(0);
    assert.equal(list.head(), 0);
  });

  it("Should get tail index correctly", () => {
    const list = new FramesIndexesList();
    assert.equal(list.tail(), null);

    list.insert(16);
    assert.equal(list.tail(), 16);

    list.insert(32);
    assert.equal(list.tail(), 32);
  });

  it("Should handle reindexing correctly", () => {
    const list = new FramesIndexesList();

    list.insert(5);
    list.insert(4);
    assert.equal(list.getIdx(5), 1);
  });

  it("Should return closest index correctly", () => {
    const list = new FramesIndexesList([0, 3, 8, 16, 17, 32, 34, 38]);
    assert.equal(list.closest(-10), 0);
    assert.equal(list.closest(8), 8);
    assert.equal(list.closest(9), 8);
    assert.equal(list.closest(14), 16);
    assert.equal(list.closest(24), 17);
    assert.equal(list.closest(25), 32);
    assert.equal(list.closest(36), 38);
    assert.equal(list.closest(100), 38);
  });
});
