<template>
  <div>
    <div style="margin: 10px; text-align: right">
      <a-tooltip>
        <template slot="title">
          展示顺序
        </template>
        <a-switch
          checked-children="正序"
          un-checked-children="倒序"
          default-checked
          style="margin: 5px"
          @change="orderChange"
        />
      </a-tooltip>
      <a-tooltip>
        <template slot="title">
          刷新
        </template>
        <a-button
          type="primary"
          shape="circle"
          :loading="fetching"
          :disabled="fetching"
          ghost
          icon="loading-3-quarters"
          @click="fetch"
          style="margin-left: 20px;"
        />
      </a-tooltip>
    </div>
    <a-table
        :columns="columns"
        :row-key="record => record.index"
        :data-source="students"
        :loading="fetching"
        bordered
      >
    </a-table>
  </div>
</template>

<script>
import * as api from '@/api/teacher'
import { date2String } from '@/util/date'

export default {
  name: 'TeacherStudents',
  data () {
    return {
      students: [],
      fetching: false,
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          width: '9%'
        },
        {
          title: '学生姓名',
          dataIndex: 'name',
          width: '20%'
        },
        {
          title: '联系方式',
          dataIndex: 'email',
          width: '25%'
        },
        {
          title: '上次考勤时间',
          dataIndex: 'latestRecordTime'
        }
      ]
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
      this.fetch()
    }
  },
  methods: {
    fetch () {
      this.fetching = true
      api.getStudents()
        .then(res => {
          this.students = res.data.map(m => {
            return {
              ...m,
              latestRecordTime: date2String(m.latestRecordTime) || '无考勤记录',
              index: res.data.indexOf(m) + 1
            }
          })
          this.fetching = false
        })
    },
    orderChange (checked) {
      const students = this.students
      if (checked) {
        students.sort((a, b) => a.index - b.index)
      } else {
        students.sort((a, b) => b.index - a.index)
      }
      this.$set(this, 'students', students)
    }
  }
}
</script>
