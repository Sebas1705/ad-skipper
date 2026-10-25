import { expect, test, vi } from "vitest";
import { findSkipButton, isVisible, press, skipIfPossible, SKIP_SELECTORS } from "../lib/skip";

type Fake = {
  offsetWidth: number;
  offsetHeight: number;
  click: () => void;
  dispatchEvent: () => void;
};

const shown = (): Fake => ({ offsetWidth: 80, offsetHeight: 30, click: vi.fn(), dispatchEvent: vi.fn() });
const hidden = (): Fake => ({ offsetWidth: 0, offsetHeight: 0, click: vi.fn(), dispatchEvent: vi.fn() });

/** A page that has these elements under these selectors, and nothing else. */
function page(bySelector: Record<string, Fake[]>): ParentNode {
  return {
    querySelectorAll: (selector: string) => bySelector[selector] ?? [],
  } as unknown as ParentNode;
}

test("an element with no size is not visible", () => {
  expect(isVisible(shown())).toBe(true);
  expect(isVisible(hidden())).toBe(false);
});

test("finds nothing on a page with no ad", () => {
  expect(findSkipButton(page({}))).toBeNull();
  expect(skipIfPossible(page({}))).toBe(false);
});

test("clicks the button when it is showing", () => {
  const button = shown();
  expect(skipIfPossible(page({ [SKIP_SELECTORS[0]!]: [button] }))).toBe(true);
  expect(button.click).toHaveBeenCalledOnce();
});

test("leaves a hidden copy alone", () => {
  const ghost = hidden();
  expect(skipIfPossible(page({ [SKIP_SELECTORS[0]!]: [ghost] }))).toBe(false);
  expect(ghost.click).not.toHaveBeenCalled();
});

test("skips past a hidden copy to the one that is showing", () => {
  const ghost = hidden();
  const real = shown();
  skipIfPossible(page({ [SKIP_SELECTORS[0]!]: [ghost, real] }));
  expect(ghost.click).not.toHaveBeenCalled();
  expect(real.click).toHaveBeenCalledOnce();
});

test("recognises every selector on the list", () => {
  for (const selector of SKIP_SELECTORS) {
    const button = shown();
    expect(skipIfPossible(page({ [selector]: [button] }))).toBe(true);
  }
});

test("presses a button that stays on screen only once", () => {
  const button = shown();
  const ad = page({ [SKIP_SELECTORS[0]!]: [button] });
  expect(skipIfPossible(ad)).toBe(true);
  expect(skipIfPossible(ad)).toBe(false);
  expect(button.click).toHaveBeenCalledOnce();
});

test("presses the button of the next ad once the first one is gone", () => {
  const first = shown();
  const second = shown();
  expect(skipIfPossible(page({ [SKIP_SELECTORS[0]!]: [first] }))).toBe(true);
  expect(skipIfPossible(page({ [SKIP_SELECTORS[0]!]: [second] }))).toBe(true);
  expect(first.click).toHaveBeenCalledOnce();
  expect(second.click).toHaveBeenCalledOnce();
});

test("falls through to a later selector when the earlier ones match nothing", () => {
  const last = SKIP_SELECTORS[SKIP_SELECTORS.length - 1]!;
  const button = shown();
  expect(findSkipButton(page({ [last]: [button] }))).toBe(button);
});

test("prefers the first selector on the list when several match", () => {
  const modern = shown();
  const legacy = shown();
  const ad = page({ [SKIP_SELECTORS[0]!]: [modern], [SKIP_SELECTORS[1]!]: [legacy] });
  expect(findSkipButton(ad)).toBe(modern);
});

test("presses with the full pointer sequence before the click", () => {
  const seen: string[] = [];
  vi.stubGlobal("window", {});
  vi.stubGlobal(
    "MouseEvent",
    class {
      type: string;
      constructor(type: string) {
        this.type = type;
      }
    },
  );
  const button = {
    dispatchEvent: (e: { type: string }) => seen.push(e.type),
    click: () => seen.push("click"),
  } as unknown as HTMLElement;
  press(button);
  vi.unstubAllGlobals();
  expect(seen).toEqual(["pointerdown", "mousedown", "pointerup", "mouseup", "click"]);
});

test("still clicks when MouseEvent is not available", () => {
  const button = shown();
  press(button as unknown as HTMLElement);
  expect(button.dispatchEvent).not.toHaveBeenCalled();
  expect(button.click).toHaveBeenCalledOnce();
});
