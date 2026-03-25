const INTERACTIVE_SELECTOR = [
  'button',
  'a[href]',
  'input',
  'textarea',
  'select',
  'label',
  'summary',
  'details',
  '[contenteditable=""]',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="combobox"]',
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="tab"]',
  '[role="textbox"]'
].join(',')

export const shouldIgnoreRowActivation = (event: MouseEvent | KeyboardEvent) => {
  const target = event.target
  const currentTarget = event.currentTarget

  if (!(target instanceof Element) || !(currentTarget instanceof Element)) {
    return false
  }

  const interactiveTarget = target.closest(INTERACTIVE_SELECTOR)
  return Boolean(interactiveTarget && interactiveTarget !== currentTarget)
}
