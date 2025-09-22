import { describe, it } from "node:test";
import assert from "node:assert";

import { getRangedBoundedIndexes } from "./FramesLoaderLazy";

describe("FramesLoaderLazy", () => {
  it("Should get ranged bounded indexes correctly ", () => {
    const res = getRangedBoundedIndexes(100, {
      range: 10,
      total: 356,
      min: 50,
      max: 300,
    });
    assert.deepEqual(
      res,
      [
        100, 101, 99, 102, 98, 103, 97, 104, 96, 105, 95, 106, 94, 107, 93, 108,
        92, 109, 91, 110, 90,
      ]
    );
  });
  it("Should get ranged bounded indexes correctly when out of bounds from min", () => {
    const res = getRangedBoundedIndexes(100, {
      range: 10,
      total: 356,
      min: 100,
      max: 300,
    });
    assert.deepEqual(
      res,
      [
        100, 101, 300, 102, 299, 103, 298, 104, 297, 105, 296, 106, 295, 107,
        294, 108, 293, 109, 292, 110, 291,
      ]
    );
  });
  it("Should get ranged bounded indexes correctly when out of bounds from max", () => {
    const res = getRangedBoundedIndexes(300, {
      range: 10,
      total: 356,
      min: 100,
      max: 300,
    });
    assert.deepEqual(
      res,
      [
        300, 100, 299, 101, 298, 102, 297, 103, 296, 104, 295, 105, 294, 106,
        293, 107, 292, 108, 291, 109, 290,
      ]
    );
  });
});
