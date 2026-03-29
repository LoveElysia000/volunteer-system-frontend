const normalizeBackendDateTime = (value: string) => value.replace(' ', 'T')

const pad = (value: number) => String(value).padStart(2, '0')

const toDate = (value: string) => {
  const normalizedValue = normalizeBackendDateTime(value)
  const date = new Date(normalizedValue)
  return Number.isNaN(date.getTime()) ? null : date
}

export const formatActivityDateTime = (value: string) => {
  const date = toDate(value)
  if (!date) {
    return value
  }

  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export const formatActivityTimeRange = (startTime: string, endTime: string) => {
  const startDate = toDate(startTime)
  const endDate = toDate(endTime)

  if (!startDate || !endDate) {
    return [startTime, endTime].filter(Boolean).join(' - ')
  }

  const startLabel = `${pad(startDate.getMonth() + 1)}-${pad(startDate.getDate())} ${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`
  const sameDay = (
    startDate.getFullYear() === endDate.getFullYear()
    && startDate.getMonth() === endDate.getMonth()
    && startDate.getDate() === endDate.getDate()
  )
  const endLabel = sameDay
    ? `${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`
    : `${pad(endDate.getMonth() + 1)}-${pad(endDate.getDate())} ${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`

  return `${startLabel} - ${endLabel}`
}
