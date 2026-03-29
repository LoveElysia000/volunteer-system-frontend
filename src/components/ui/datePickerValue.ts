export type DatePickerMode = 'date' | 'datetime' | 'datetime-seconds'

export type DatePickerValue =
  | string
  | string[]
  | [string, string]
  | null

const pad = (value: number) => String(value).padStart(2, '0')

const formatParts = (date: Date, mode: DatePickerMode) => {
  const base = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

  if (mode === 'date') {
    return base
  }

  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`
  if (mode === 'datetime') {
    return `${base} ${time}`
  }

  return `${base} ${time}:${pad(date.getSeconds())}`
}

const normalizeSingleValue = (value: string, mode: DatePickerMode) => {
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/)
  if (isoMatch) {
    const [, year, month, day, hours = '00', minutes = '00', seconds = '00'] = isoMatch
    if (mode === 'date') return `${year}-${month}-${day}`
    if (mode === 'datetime') return `${year}-${month}-${day} ${hours}:${minutes}`
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const localeMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,\s*(\d{1,2}):(\d{2})(?::(\d{2}))?)?/)
  if (localeMatch) {
    const [, month, day, year, hours = '00', minutes = '00', seconds = '00'] = localeMatch
    const normalizedDate = `${year}-${pad(Number(month))}-${pad(Number(day))}`
    if (mode === 'date') return normalizedDate
    if (mode === 'datetime') return `${normalizedDate} ${pad(Number(hours))}:${minutes}`
    return `${normalizedDate} ${pad(Number(hours))}:${minutes}:${seconds}`
  }

  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) {
    return formatParts(parsed, mode)
  }

  return value
}

export const normalizeDatePickerValue = (
  value: DatePickerValue,
  mode: DatePickerMode
): DatePickerValue => {
  if (value === null) return null

  if (Array.isArray(value)) {
    return value.map((item) => normalizeSingleValue(item, mode)) as DatePickerValue
  }

  return normalizeSingleValue(value, mode)
}
