<template>
  <div>
    <div>
      <a-select
        mode="default"
        :value="selectedItems"
        style="width: 100%"
        @select="handleChange"
      >
        <a-select-option
          v-for="(item, key) in filteredOptions"
          :key="key"
          :value="`${item.index} - ${item.name} （${item.email}）`"
        >
            {{ item.index }} - {{ item.name }}（{{ item.email }}）
        </a-select-option>
      </a-select>
    </div>
    <div style="margin-top: 20px;">
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
    </div>
  </div>
</template>

<script>
import * as api from '@/api/teacher'
import { date2String } from '@/util/date'

export default {
  name: 'TeacherRecords',
  data () {
    return {
      students: [],
      selectedItems: '',
      selectedId: -1,
      records: [],
      pagination: {
        pageSize: 10,
        total: 0,
        current: 1
      },
      fetching: false,
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          width: '9%'
        },
        {
          title: '签到地点',
          dataIndex: 'position',
          width: '25%'
        },
        {
          title: '签到内容',
          dataIndex: 'lecture',
          width: '35%'
        },
        {
          title: '签到时间',
          dataIndex: 'rtime'
        }
      ]
    }
  },
  computed: {
    filteredOptions () {
      return this.students.filter(o => this.selectedItems !== o)
    },
    isTeacher () {
      return this.$store.getters.isTeacher
    }
  },
  watch: {
    selectedItems (newVal) {
      if (newVal !== '') {
        const index = parseInt(newVal.split('-')[0].trim())
        this.selectedChange(index)
      }
    }
  },
  mounted () {
    if (this.isTeacher === false) {
      this.$router.push('/')
    } else {
      this.fetch()
    }
  },
  methods: {
    handleChange (selectedItems) {
      this.selectedItems = selectedItems
    },
    fetch () {
      api.getStudents()
        .then(res => {
          this.students = res.data.map(m => {
            return {
              ...m,
              latestRecordTime: date2String(m.latestRecordTime) || '无考勤记录',
              index: res.data.indexOf(m) + 1
            }
          })
        })
    },
    selectedChange (index) {
      const item = this.students.find(t => t.index === index)
      const id = item.id
      this.selectedId = id
      this.fetchRecords()
    },
    fetchRecords (params = {}) {
      if (Object.keys(params).length === 0) {
        params = this.pagination
      }
      this.fetching = true
      const pagination = { ...this.pagination }
      const offset = pagination.current - 1 || 0
      const pageSize = pagination.pageSize || 20
      api.getRecords(this.selectedId, pageSize, offset)
        .then(res => {
          const data = res.data
          const count = data.total
          const records = data.records
          for (let i = 0; i < records.length; i++) {
            records[i].index = i + 1 + pageSize * offset
            records[i].lecture = records[i].detail.title
            records[i].rtime = date2String(records[i].rtime)
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
      const pager = { ...this.pagination }
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
