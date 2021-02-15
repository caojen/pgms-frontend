// @ts-nocheck
import * as xlsx from 'xlsx'
import FileSaver from 'file-saver'
import JSZip from 'jszip'
import http from '@/util/http'

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

/**
 *
 * @param detail url: 文件地址；filename：文件名；subdir：一级子目录名（如果不提供，那么放在根目录），以/结尾
 * @param config zipname：打包后的文件名;
 */
export async function downloadFilesAndZip (detail: {
  url: string;
  filename: string;
  subdir?: string;
}[], config?: { zipname: string} = { zipname: 'package.zip' }) {
  function getFile (url) {
    return http.get(url, { responseType: 'blob' })
  }

  const zip = new JSZip()
  for (let i = 0; i < detail.length; i++) {
    const { url, filename, subdir } = detail[i]
    const data = (await getFile(url)).data
    if (!subdir) {
      subdir = ''
    }
    zip.file(`${subdir}/${filename}`, data, { binary: true })
  }

  zip.generateAsync({ type: 'blob' }).then(content => {
    // 生成二进制流后，使用file-saver下载
    FileSaver.saveAs(content, config.zipname)
  })
}
