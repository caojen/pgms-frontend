import strftime from 'strftime'

export function date2String (d: Date): string {
  return strftime('%F %T', d)
}
