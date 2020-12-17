// @ts-nocheck
import * as xlsx from 'xlsx'

// 字符串转ArrayBuffer
function s2ab (s) {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF
  }
  return buf
}

export function book2blob (workbook: xlsx.WorkBook) {
  // 生成excel的配置项
  const wopts = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary'
  }
  const wbout = xlsx.write(workbook, wopts)
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
  return blob
}

export function openDownloadDialog (url: string | Blob, saveName: string) {
  if (typeof url === 'object' && url instanceof Blob) {
    url = URL.createObjectURL(url) // 创建blob地址
  }
  const aLink = document.createElement('a')
  aLink.href = url
  aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  let event
  if (window.MouseEvent) {
    event = new MouseEvent('click')
  } else {
    event = document.createEvent('MouseEvents')
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  }
  aLink.dispatchEvent(event)
}
