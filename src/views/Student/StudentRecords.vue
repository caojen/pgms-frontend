<template>
  <a-table
      :columns="columns"
      :row-key="record => record.index"
      :data-source="records"
      :pagination="pagination"
      :loading="fetching"
      @change="handleTableChange"
      bordered
    >
  </a-table>
</template>

<script>
import * as api from '@/api/student'
import { date2String } from '@/util/date'

export default {
  name: 'StudentRecords',
  data () {
    return {
      fetching: false,
      records: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          width: '8%'
        },
        {
          title: '签到时间',
          dataIndex: 'rtime',
          width: '20%'
        },
        {
          title: '签到地点',
          dataIndex: 'position',
          width: '20%'
        },
        {
          title: '签到详情',
          dataIndex: 'lecture'
        }
      ]
    }
  },
  mounted () {
    this.fetchRecords()
  },
  methods: {
    fetchRecords (params = {}) {
      if (Object.keys(params).length === 0) {
        params = this.pagination
      }
      this.fetching = true
      const pagination = { ...this.pagination }
      const offset = pagination.current - 1 || 0
      const pageSize = pagination.pageSize || 10
      api.getRecords(pageSize, offset)
        .then(res => {
          const data = res.data
          const count = data.total
          const records = data.records
          for (let i = 0; i < records.length; i++) {
            records[i].index = i + 1 + pageSize * offset
            records[i].lecture = records[i].detail.title
            records[i].rtime = date2String(new Date(records[i].rtime))
          }
          this.fetching = false
          this.records = records
          this.pagination = {
            total: count,
            pageSize,
            current: offset + 1
          }
        })
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.paginations }
      pager.current = pagination.current
      this.pagination = pager
      this.fetchRecords({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      })
    }
  }
}
</script>
