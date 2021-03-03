<template>
  <div>
    <div style="height: 40px">
      <a-row>
        <a-col :span="3" :offset="21">
          <a-upload
            :file-list="filelist"
            :before-upload="beforeUploadFile"
            :showUploadList="false"
          >
            <a-button type="primary"> <a-icon type="upload" /> 上传文件 </a-button>
          </a-upload>
        </a-col>
      </a-row>
    </div>

    <a-table
      :columns="columns"
      :data-source="files"
      :row-key="record => record.index"
    >
      <span slot="action" slot-scope="text, record">
        <a-config-provider :auto-insert-space-in-button="false">
          <a-button type="primary" @click="download(record)">
            下载
          </a-button>
        </a-config-provider>
        <a-divider type="vertical"/>
        <a-config-provider :auto-insert-space-in-button="false">
          <a-button type="danger" @click="deleteFile(record)">
            删除
          </a-button>
        </a-config-provider>
      </span>
    </a-table>
  </div>
</template>

<script>
import * as api from '@/api/bistudent'
import { openDownloadDialog } from '@/util/fs'

export default {
  name: 'BistudentFile',
  data () {
    return {
      files: [],
      filelist: [],
      columns: [
        { title: '序号', dataIndex: 'index', width: '12%' },
        { title: '文件名', dataIndex: 'filename', width: '65%' },
        { title: '操作', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      api.getFileList()
        .then(res => {
          this.files = []
          for (let i = 0; i < res.data.length; i++) {
            this.files.push({
              ...res.data[i],
              index: i + 1
            })
          }
          console.log(this.files)
        })
    },
    beforeUploadFile (file) {
      this.filelist = [file]
      api.postFile(file)
        .then(() => {
          this.$message.success('上传文件成功')
          this.fetch()
        })
      return false
    },
    download (record) {
      const { fid, filename } = record
      api.getFile(fid)
        .then(res => {
          const file = res.data
          openDownloadDialog(file, filename)
        })
    },
    deleteFile (record) {
      const { fid } = record
      api.deleteFile(fid)
        .then(() => {
          this.$message.success('删除文件成功')
          this.fetch()
        })
    }
  }
}
</script>
