<template>
  <div>
    <a-table
        :columns="columns"
        :row-key="record => record.index"
        :data-source="lectures"
        :pagination="pagination"
        :loading="fetching"
        @change="handleTableChange"
        bordered
      >
        <span slot="action" slot-scope="text, record">
          <a-button type="primary" ghost @click="moreInfo(record)">
            查看详情
          </a-button>
        </span>
    </a-table>

    <!-- 查看讲座详情界面 -->
    <a-modal
      v-model="showingDetail"
      title="讲座详情"
      @ok="() => showingDetail = false"
      :width=500
    >
      <p>
        {{ detail.content || '无详情介绍' }}
      </p>
    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api/teacher'
import { date2String } from '@/util/date'

export default {
  name: 'TeacherLectures',
  data () {
    return {
      fetching: false,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      lectures: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          width: '9%'
        },
        {
          title: '讲座名',
          dataIndex: 'title',
          width: '40%'
        },
        {
          title: '开始时间',
          dataIndex: 'start',
          width: '20%'
        },
        {
          title: '结束时间',
          dataIndex: 'end',
          width: '20%'
        },
        {
          title: '查看讲座内容',
          scopedSlots: { customRender: 'action' }
        }
      ],
      showingDetail: false,
      detail: {}
    }
  },
  computed: {
    isTeacher () {
      return this.$store.getters.isTeacher
    }
  },
  mounted () {
    if (this.isTeacher === false) {
      this.$router.push('/')
    } else {
      this.fetchLectures()
    }
  },
  methods: {
    fetchLectures (param = {}) {
      if (Object.keys(param).length === 0) {
        param = this.pagination
      }
      this.fetching = true
      const pagination = { ...this.pagination }
      const offset = pagination.current - 1 || 0
      const pageSize = pagination.pageSize || 10
      api.getLectures(pageSize, offset)
        .then(res => {
          const data = res.data
          const count = data.count
          const lectures = data.lectures

          for (let i = 0; i < lectures.length; i++) {
            lectures[i].index = i + 1 + pageSize * offset
            lectures[i].start = date2String(new Date(lectures[i].start))
            lectures[i].end = date2String(new Date(lectures[i].end))
          }
          this.lectures = lectures
          this.fetching = false
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
      this.fetchLectures({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      })
    },
    moreInfo (record) {
      this.showingDetail = true
      this.detail = record
    }
  }
}
</script>
