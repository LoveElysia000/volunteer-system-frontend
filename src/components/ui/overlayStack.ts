let nextOverlayId = 0
type OverlayEntry = {
  id: number
  element: HTMLElement | null
}

const overlayStack: OverlayEntry[] = []
const BASE_OVERLAY_Z_INDEX = 1000

export const registerOverlay = () => {
  const id = ++nextOverlayId
  overlayStack.push({ id, element: null })
  return id
}

export const unregisterOverlay = (id: number) => {
  const index = overlayStack.findIndex((entry) => entry.id === id)
  if (index !== -1) {
    overlayStack.splice(index, 1)
  }
}

export const isTopOverlay = (id: number | null | undefined) => {
  return typeof id === 'number' && overlayStack[overlayStack.length - 1]?.id === id
}

export const getOverlayZIndex = (id: number | null | undefined) => {
  if (typeof id !== 'number') {
    return BASE_OVERLAY_Z_INDEX
  }

  const stackIndex = overlayStack.findIndex((entry) => entry.id === id)
  return BASE_OVERLAY_Z_INDEX + (stackIndex === -1 ? overlayStack.length : stackIndex) + 1
}

export const setOverlayElement = (id: number, element: HTMLElement | null) => {
  const entry = overlayStack.find((overlay) => overlay.id === id)
  if (entry) {
    entry.element = element
  }
}

export const getTopOverlayElement = () => {
  return overlayStack[overlayStack.length - 1]?.element ?? null
}

export const hasOpenOverlays = () => {
  return overlayStack.length > 0
}
