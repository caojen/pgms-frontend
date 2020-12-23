<template>
  <div>
    <div style="height: 40px">
      <a-row>
        <a-col :span="3" :offset="21">
          <a-button type="primary" icon="plus" @click="handleAddRecord()">
            学生补签
          </a-button>
        </a-col>
      </a-row>
    </div>
    <a-table
      :columns="recordsColumn"
      :row-key="record => record.index"
      :data-source="records"
      :pagination="paginations"
      :loading="fetchingRecords"
      @change="handleTableChange"
    >
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          ok-text="确认删除"
          cancel-text="取消"
          @confirm="deleteRecord(record.id)"
        >
          <template slot="title">
            <div>确定要删除这次签到吗？</div>
            <div>注意：除非是补签，否则不可能删除讲座签到</div>
            <div>警告：删除操作不可撤销</div>
          </template>
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button type="danger" ghost>
              删除签到
            </a-button>
          </a-config-provider>
        </a-popconfirm>
      </span>
    </a-table>

    <!-- 添加签到Modal -->
    <a-modal
      v-model="showingAddRecord"
      title="添加签到"
      @ok="addRecordConfirm"
    >
      <div class="input">
        <span>学生登录账号：</span>
        <a-select
          show-search
          :value="selectedStudent"
          style="width: 100%"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="fetchingStudents"
          @search="handleSearchStudent"
          @change="handleChangeStudent"
        >
          <a-select-option v-for="d in students" :key="d.index">
            {{ d.username }}（{{ d.name }}）
          </a-select-option>
        </a-select>
      </div>

      <div class="input">
        <span>选择讲座：</span>
        <a-select
          show-search
          :value="selectedLecture"
          style="width: 100%"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          @change="handleChangeLecture"
        >
          <a-select-option v-for="d in lectures" :key="d.index">
            {{ d.title }}
          </a-select-option>
        </a-select>
      </div>

      <div class="input">
        <span>选择签到位置：</span>
        <a-select
          show-search
          :value="selectedPosition"
          style="width: 100%"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          @change="handleChangePosition"
        >
          <a-select-option v-for="d in positions" :key="d.index">
            {{ d.description }}（{{ d.device }}）
          </a-select-option>
        </a-select>
      </div>
    </a-modal>

  </div>
</template>

<script>
import * as api from '@/api/attendAdmin'
import { date2String } from '@/util/date'

export default {
  name: 'AttendAdminRecords',
  data () {
    return {
      showingAddRecord: false,
      fetchingRecords: false,
      records: [],
      paginations: {
        total: 0,
        current: 1,
        pageSize: 20
      },
      recordsColumn: [
        {
          title: '序号',
          dataIndex: 'index',
          width: '7%'
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: '12%'
        },
        {
          title: '学号',
          dataIndex: 'student_id',
          width: '15%'
        },
        {
          title: '登录账号',
          dataIndex: 'username',
          width: '15%'
        },
        {
          title: '签到时间',
          dataIndex: 'rtime',
          width: '15%'
        },
        {
          title: '签到地点',
          dataIndex: 'position',
          width: '10%'
        },
        {
          title: '签到详情',
          dataIndex: 'lecture',
          width: '15%'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      fetchingStudents: false,
      students: [],
      studentUsername: '',
      selectedStudentId: '',
      selectedStudent: '',
      positions: [],
      selectedPosition: '',
      selectedPositionId: -1,
      lectures: [],
      selectedLecture: '',
      selectedLectureId: -1
    }
  },
  mounted () {
    this.fetchRecords()
    this.fetchLectures()
  },
  methods: {
    handleAddRecord () {
      this.showingAddRecord = true
    },
    fetchRecords (params = {}) {
      if (Object.keys(params).length === 0) {
        params = this.paginations
      }
      this.fetchingRecords = true
      const pagination = { ...this.paginations }
      const offset = pagination.current - 1 || 0
      const pageSize = pagination.pageSize || 20
      api.getAllRecords(pageSize, offset)
        .then(res => {
          const data = res.data
          const count = data.count
          const records = data.records
          for (let i = 0; i < records.length; i++) {
            records[i].index = i + 1 + pageSize * offset
            records[i].lecture = records[i].detail.title
            records[i].rtime = date2String(new Date(records[i].rtime))
          }
          this.fetchingRecords = false
          this.records = records
          this.paginations = {
            total: count,
            pageSize,
            current: offset + 1
          }
        })
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.paginations }
      pager.current = pagination.current
      this.showingTeachersTablePagination = pager
      this.fetchRecords({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      })
    },
    deleteRecord (rid) {
      api.deleteOneRecord(rid)
        .then(() => {
          this.$message.success('删除成功')
          this.fetchRecords()
        })
    },
    fetchStudents () {
      this.fetchingStudents = true
      api.queryStudentsByUsername(this.studentUsername)
        .then(res => {
          const students = res.data
          for (let i = 0; i < students.length; i++) {
            students[i].index = i
          }
          this.students = students
          this.fetchingStudents = false
        })
    },
    fetchPositions () {
      api.getAllPositions()
        .then(res => {
          this.positions = res.data
        })
    },
    fetchLectures () {
      api.getAllLecturesWithoutQuery()
        .then(res => {
          const lectures = res.data
          for (let i = 0; i < lectures.length; i++) {
            lectures[i].index = i
          }
          this.lectures = lectures
        })
    },
    addRecordConfirm () {
      if (this.selectedLectureId && this.selectedPosition && this.selectedLecture) {
        api.addOneRecord(this.selectedLectureId, this.selectedStudentId, this.selectedPositionId)
          .then(() => {
            this.$message.success('补签成功')
            this.selectedPosition = ''
            this.selectedPositionId = -1
            this.selectedLecture = ''
            this.selectedLectureId = -1
            this.selectedStudentId = -1
            this.selectedStudent = ''
            this.showingAddRecord = false
            this.fetchRecords()
          })
      } else {
        this.$message.error('请提供完整信息')
      }
    },
    handleSearchStudent (s) {
      this.studentUsername = s
      if (this.studentUsername) {
        this.fetchStudents()
      }
    },
    handleChangeStudent (s) {
      this.selectedStudent = this.students[s].username
      this.selectedStudentId = this.students[s].sid
    },
    handleChangeLecture (s) {
      this.selectedLecture = this.lectures[s].title
      this.selectedLectureId = this.lectures[s].id
      const positions = this.lectures[s].positions
      for (let i = 0; i < positions.length; i++) {
        positions[i].index = i
      }
      this.positions = positions
      this.selectedPosition = ''
      this.selectedPositionId = -1
    },
    handleChangePosition (s) {
      this.selectedPosition = this.positions[s].description
      this.selectedPositionId = this.positions[s].id
    }
  }
}
</script>

<style scoped>
.input {
  margin: 5px;
}
</style>
