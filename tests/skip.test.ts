import { expect, test, vi } from "vitest";
import { findSkipButton, isVisible, skipIfPossible, SKIP_SELECTORS } from "../lib/skip";

type Fake = { offsetWidth: number; offsetHeight: number; click: () => void };

const shown = (): Fake => ({ offsetWidth: 80, offsetHeight: 30, click: vi.fn() });
const hidden = (): Fake => ({ offsetWidth: 0, offsetHeight: 0, click: vi.fn() });

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
