<template>
  <div>
    <div id="controller">
      <a-statistic
        title="文件统计"
        :value="filesCount"
        style="margin-right: 50px; float: right;"
        value-style="float: right; color: green"
      />
    </div>
    <div>
      <a-select
        style="width: 700px; max-width: 80%;"
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
      style="width: 700px; max-width: 80%;"
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

export default {
  name: 'BichoiceAdminFiles',
  data () {
    return {
      filesCount: 0,
      bistudents: [],
      selectedBistudentId: 0,
      files: [{ fid: 1, filename: 'filename' }],
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
      api.getBistudentFiles(this.selectedBistudentId)
        .then(res => {
          console.log(res.data)
        })
    },
    downloadFile (record) {
      const fid = record.fid
      api.getFile(fid)
        .then(res => {
          const data = res.data
          const blob = new Blob([data])
          const objectUrl = URL.createObjectURL(blob)
          location.href = objectUrl
          URL.revokeObjectURL(objectUrl)
        })
    }
  }
}
</script>

<style scoped>
#controller {
  float: right;
}
</style>
