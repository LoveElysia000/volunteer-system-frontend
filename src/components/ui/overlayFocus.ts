const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  'summary'
].join(',')

export const captureFocusedElement = () => {
  if (typeof document === 'undefined') {
    return null
  }

  return document.activeElement instanceof HTMLElement ? document.activeElement : null
}

export const restoreFocus = (element: HTMLElement | null) => {
  if (!element || typeof document === 'undefined' || !element.isConnected) {
    return
  }

  element.focus()
}

export const restoreFocusIfAllowed = (element: HTMLElement | null, activeOverlayRoot: HTMLElement | null, hasOpenOverlay = false) => {
  if (!element || typeof document === 'undefined' || !element.isConnected) {
    return
  }

  if (hasOpenOverlay && !activeOverlayRoot) {
    return
  }

  if (activeOverlayRoot && !activeOverlayRoot.contains(element)) {
    return
  }

  element.focus()
}

export const getFocusableElements = (root: HTMLElement) => {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => {
    return element.getClientRects().length > 0 || element === document.activeElement
  })
}

export const focusInitialElement = (root: HTMLElement) => {
  const focusable = getFocusableElements(root)
  if (focusable.length > 0) {
    focusable[0].focus()
    return
  }

  root.focus()
}

export const trapTabWithinOverlay = (event: KeyboardEvent, root: HTMLElement) => {
  if (event.key !== 'Tab') {
    return false
  }

  const focusable = getFocusableElements(root)
  if (focusable.length === 0) {
    event.preventDefault()
    root.focus()
    return true
  }

  const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
  if (!activeElement || !root.contains(activeElement)) {
    event.preventDefault()
    focusable[0].focus()
    return true
  }

  if (activeElement === root) {
    event.preventDefault()
    if (event.shiftKey) {
      focusable[focusable.length - 1].focus()
    } else {
      focusable[0].focus()
    }
    return true
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey) {
    if (activeElement === first) {
      event.preventDefault()
      last.focus()
      return true
    }
    return false
  }

  if (activeElement === last) {
    event.preventDefault()
    first.focus()
    return true
  }

  return false
}
