export type Dimensions = { width: number; height: number };
export type ObjectFit = "fill" | "contain" | "cover" | "none" | "scale-down";
export type ObjectPosition =
  | [ObjectPositionValue]
  | [ObjectPositionValue, ObjectPositionValue];
type ObjectPositionValue = ObjectPositionKeyword | Pct | Px;
type ObjectPositionKeyword = "top" | "right" | "bottom" | "left" | "center";
type Pct = `${number}%` | `${number}` | number;
type Px = `${number}px`;

type CalculationParams = {
  container?: Dimensions;
  object: Dimensions;
  fit?: ObjectFit;
  position?: ObjectPosition;
};

export class ObjectPlacement {
  public container: Dimensions = { width: 0, height: 0 };

  constructor(container?: Dimensions) {
    if (container) this.setContainer(container);
  }

  setContainer(container: Dimensions) {
    this.container = container;
  }

  calc({
    object,
    container,
    fit = "fill",
    position = ["center"],
  }: CalculationParams) {
    container ||= this.container;
    const { width, height } = parseObjectFit(object, container, fit);
    const { x, y } = parseObjectPosition(
      { width, height },
      container,
      position
    );
    return { x, y, width, height };
  }
}

function parseObjectFit(
  object: Dimensions,
  container: Dimensions,
  fit: ObjectFit = "fill"
) {
  const objWidth = object.width;
  const objHeight = object.height;
  const containerWidth = container.width;
  const containerHeight = container.height;

  let renderWidth = containerWidth;
  let renderHeight = containerHeight;

  const objRatio = objWidth / objHeight;
  const containerRatio = containerWidth / containerHeight;

  switch (fit) {
    case "contain":
      if (objRatio > containerRatio) {
        renderWidth = containerWidth;
        renderHeight = containerWidth / objRatio;
      } else {
        renderHeight = containerHeight;
        renderWidth = containerHeight * objRatio;
      }
      break;

    case "cover":
      if (objRatio > containerRatio) {
        renderHeight = containerHeight;
        renderWidth = containerHeight * objRatio;
      } else {
        renderWidth = containerWidth;
        renderHeight = containerWidth / objRatio;
      }
      break;

    case "none":
      renderWidth = objWidth;
      renderHeight = objHeight;
      break;

    case "scale-down":
      const scaleDownWidth = objWidth;
      const scaleDownHeight = objHeight;

      let containW = containerWidth,
        containH = containerHeight;
      if (objRatio > containerRatio) {
        containW = containerWidth;
        containH = containerWidth / objRatio;
      } else {
        containH = containerHeight;
        containW = containerHeight * objRatio;
      }

      if (
        scaleDownWidth <= containerWidth &&
        scaleDownHeight <= containerHeight
      ) {
        renderWidth = scaleDownWidth;
        renderHeight = scaleDownHeight;
      } else {
        renderWidth = containW;
        renderHeight = containH;
      }
      break;

    case "fill":
    default:
      renderWidth = containerWidth;
      renderHeight = containerHeight;
      break;
  }

  return { width: renderWidth, height: renderHeight };
}

function parseObjectPosition(
  object: Dimensions,
  container: Dimensions,
  position: ObjectPosition
) {
  const objectWidth = object.width;
  const objectHeight = object.height;
  const containerWidth = container.width;
  const containerHeight = container.height;
  const positionsArr = position.map((v) => v.toString().replaceAll(" ", ""));

  if (positionsArr.length === 1) {
    const pos = positionsArr[0];
    if (["top", "bottom"].includes(pos)) positionsArr.unshift("center");
    else positionsArr.push("center");
  }

  const poxX = positionsArr[0];
  const poxY = positionsArr[1];

  const x = positionToValue(poxX, containerWidth - objectWidth);
  const y = positionToValue(poxY, containerHeight - objectHeight);

  return { x, y };
}

function positionToValue(pos: string, baseSize: number) {
  if (isKeyword(pos)) return pctToValue(keywordToPct(pos), baseSize);
  if (isPct(pos)) return pctToValue(pos, baseSize);
  if (isPx(pos)) return pxToValue(pos);
  return null;
}

function keywordToPct(keyword: ObjectPositionKeyword): number {
  if (keyword === "left") return 0;
  if (keyword === "right") return 100;
  if (keyword === "top") return 0;
  if (keyword === "bottom") return 100;
  return 50;
}

function pxToValue(value: Px): number | null {
  const int = parseInt(value);
  return isNaN(int) ? null : int;
}

function pctToValue(value: Pct, baseSize: number): number | null {
  const int = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(int)) return null;
  return baseSize * (int / 100);
}

function isKeyword(value: string): value is ObjectPositionKeyword {
  return ["left", "right", "top", "bottom", "center"].includes(value);
}

function isPx(value: string): value is Px {
  return value.endsWith("px") && !isNaN(parseInt(value));
}

function isPct(value: string | number): value is Pct {
  if (typeof value === "number") return isFinite(value);
  if (isFinite(Number(value))) return true;
  return value.endsWith("%") && isFinite(parseFloat(value));
}
