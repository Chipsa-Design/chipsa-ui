export const clamp = (min: number, max: number, value: number) => {
  return Math.max(min, Math.min(max, value));
};

export const binaryClosest = (value: number, arr: number[]): number => {
  let low = 0;
  let high = arr.length;

  while (low < high) {
    const mid = (low + high) >>> 1;
    if (arr[mid] < value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  const leftVal = arr[low - 1];
  const rightVal = arr[low];
  if (leftVal === undefined) return rightVal;
  if (rightVal === undefined) return leftVal;

  const leftDiff = value - leftVal;
  const rightDiff = rightVal - value;
  return leftDiff < rightDiff ? leftVal : rightVal;
};

export const binaryInsert = (value: number, arr: number[]): number => {
  let low = 0;
  let high = arr.length;

  while (low < high) {
    const mid = (low + high) >>> 1; // unsigned right shift for faster floor
    if (arr[mid] < value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  arr.splice(low, 0, value);
  return low;
};
