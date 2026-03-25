let lockCount = 0
let previousOverflow = ''

const getBody = () => {
  if (typeof document === 'undefined') {
    return null
  }

  return document.body
}

export const lockBodyScroll = () => {
  const body = getBody()
  if (!body) {
    return
  }

  if (lockCount === 0) {
    previousOverflow = body.style.overflow
  }

  lockCount += 1
  body.style.overflow = 'hidden'
}

export const unlockBodyScroll = () => {
  const body = getBody()
  if (!body || lockCount === 0) {
    return
  }

  lockCount = Math.max(0, lockCount - 1)

  if (lockCount === 0) {
    body.style.overflow = previousOverflow
  }
}
