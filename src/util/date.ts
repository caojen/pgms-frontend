import strftime from 'strftime'

export function date2String (d: Date | string | null): string {
  if (d instanceof Date) {
    return strftime('%F %T', d)
  } else if (d) {
    d = new Date(d)
    return strftime('%F %T', d)
  } else {
    return ''
  }
}
