/* eslint-disable */
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

export function dateFormat (fmt: string, date: Date) {
  const opt: any = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
  }
  for (const k in opt) {
    const ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}
