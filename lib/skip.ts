/**
 * Every class name the player has used for the "Skip" button. The player is
 * redesigned now and then, so this list is the one place that ages: when the
 * extension stops working, look here first.
 */
export const SKIP_SELECTORS = [
  ".ytp-skip-ad-button",
  ".ytp-ad-skip-button-modern",
  ".ytp-ad-skip-button",
  ".ytp-ad-skip-button-container button",
  ".ytp-skip-ad button",
  // Name families and ids rather than exact class names, so a redesign that
  // keeps "skip-button" in the name still works. None of these depend on the
  // button's label, which the player translates.
  'button[class*="skip-button"]',
  'button[id^="skip-button"]',
  '[id^="skip-button"] button',
];

type Box = { offsetWidth: number; offsetHeight: number };

/** Rendered, not merely present: the player keeps hidden copies around. */
export function isVisible(el: Box): boolean {
  return el.offsetWidth > 0 && el.offsetHeight > 0;
}

/**
 * The Skip button the viewer could click right now, or null.
 *
 * It only ever finds the button the player itself offers. It does not hide,
 * block or fast-forward anything: an ad that cannot be skipped is left alone.
 */
export function findSkipButton(root: ParentNode): HTMLElement | null {
  for (const selector of SKIP_SELECTORS) {
    for (const el of root.querySelectorAll<HTMLElement>(selector)) {
      if (isVisible(el)) return el;
    }
  }
  return null;
}

/** Buttons already pressed, so one that lingers on screen is pressed once. */
const pressed = new WeakSet<object>();

/**
 * Presses the button the way a pointer would: the whole down/up sequence and
 * then the click, in case the player listens to more than `click`.
 */
export function press(button: HTMLElement): void {
  if (typeof MouseEvent !== "undefined") {
    for (const type of ["pointerdown", "mousedown", "pointerup", "mouseup"]) {
      button.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
    }
  }
  button.click();
}

/** Presses the Skip button if there is a new one. Returns whether it did. */
export function skipIfPossible(root: ParentNode): boolean {
  const button = findSkipButton(root);
  if (!button || pressed.has(button)) return false;
  pressed.add(button);
  press(button);
  return true;
}
