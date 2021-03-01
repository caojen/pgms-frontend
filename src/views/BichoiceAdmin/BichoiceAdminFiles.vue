<template>
  <div>
    <div id="controller">
      <a-statistic
        title="文件统计"
        :value="filesCount"
        value-style="color: green; padding-right: 2px"
      />
      <a-button type="primary" block style="margin-top: 10px;" @click="downloadFiles"> 下载文件 </a-button>
      <a-button type="primary" block style="margin-top: 5px;" @click="downloadAllFiles"> 下载所有文件 </a-button>
    </div>
    <div>
      <a-select
        style="width: 1000px; max-width: 80%;"
        @change="selectChange"
        placeholder="请选择学生"
      >
        <a-select-option v-for="(item, index) in bistudents" :key="index" :value="item.id">
          {{ item.id }} - {{ item.username }} - {{ item.name }}
        </a-select-option>
      </a-select>
    </div>

    <a-table
      :columns="columns"
      :data-source="files"
      style="width: 1000px; max-width: 80%;"
      :row-key="record => record.fid"
    >
      <span slot="action" slot-scope="text, record">
        <a-button
          type="link"
          @click="downloadFile(record)"
        >
          下载
        </a-button>
      </span>
    </a-table>
  </div>
</template>

<script>
import * as api from '@/api/bichoiceAdmin'
import * as url from '@/api/bichoiceAdmin/api'
import { downloadFilesAndZip, openDownloadDialog } from '@/util/fs'

export default {
  name: 'BichoiceAdminFiles',
  data () {
    return {
      filesCount: 0,
      bistudents: [],
      selectedBistudentId: 0,
      selectedBistudentIndex: 0,
      files: [],
      columns: [
        { title: 'fid', dataIndex: 'fid', width: '10%' },
        { title: '文件名', dataIndex: 'filename', width: '70%' },
        { title: '操作', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  mounted () {
    this.fetchFilesCount()
    this.fetchBistudent()
  },
  methods: {
    fetchFilesCount () {
      api.getFilesCount()
        .then(res => {
          this.filesCount = res.data.count
        })
    },
    fetchBistudent () {
      api.getBistudentsInfoBrief()
        .then(res => {
          this.bistudents = res.data
        })
    },
    selectChange (record) {
      this.selectedBistudentId = record
      this.selectedBistudentIndex = -1
      for (let i = 0; i < this.bistudents.length; i++) {
        if (this.bistudents[i].id === record) {
          this.selectedBistudentIndex = i
          break
        }
      }
      api.getBistudentFiles(this.selectedBistudentId)
        .then(res => {
          this.files = res.data
        })
    },
    downloadFile (record) {
      const fid = record.fid
      console.log(record)
      api.getFile(fid)
        .then(res => {
          const data = res.data
          const blob = new Blob([data])
          openDownloadDialog(blob, record.filename)
        })
    },
    downloadFiles () {
      if (this.files.length === 0) {
        this.$message.error('没有需要下载的文件')
      } else {
        const prefix = url.getFile
        const detail = []
        for (let i = 0; i < this.files.length; i++) {
          detail.push({
            url: `${prefix}/${this.files[i].fid}`,
            filename: this.files[i].filename
          })
        }
        const student = this.bistudents[this.selectedBistudentIndex]
        downloadFilesAndZip(detail, { zipname: `${student.username}-${student.name}` })
          .then(() => {
            this.$message.success('下载已完成')
          })
          .catch(() => {
            this.$message.success('下载失败')
          })
      }
    },
    downloadAllFiles () {
      console.log('即将下载所有文件')
      api.getFileList()
        .then(res => {
          const list = res.data
          const prefix = url.getFile
          const detail = []
          for (const key in list) {
            const value = list[key]
            const subdir = `${value.username}-${value.name}`
            const files = value.files
            for (let i = 0; i < files.length; i++) {
              detail.push({
                url: `${prefix}/${files[i].fid}`,
                filename: files[i].filename,
                subdir
              })
            }
          }

          downloadFilesAndZip(detail, { zipname: '所有学生上传文件' })
            .then(() => {
              this.$message.success('下载已完成')
            })
            .catch(() => {
              this.$message.success('下载失败')
            })
        })
    }
  }
}
</script>

<style scoped>
#controller {
  width: 15%;
  position: absolute;
  right: 10px;
  text-align: right;
}
</style>
