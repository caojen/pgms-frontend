<template>
  <div>
    <div style="height: 40px">
      <a-row>
        <a-col :span="3" :offset="21">
          <a-button type="primary" icon="plus" @click="handleShowAddLecture()">
            添加讲座
          </a-button>
        </a-col>
      </a-row>
    </div>
    <a-table
      :columns="lecturesTableColumn"
      :row-key="record => record.index"
      :data-source="lectures"
      :pagination="lecturesTablePagination"
      :loading="fetchingLectures"
      @change="handleTableChange"
    >
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          ok-text="确认删除"
          cancel-text="取消"
          @confirm="deleteLecture(record.id)"
        >
          <template slot="title">
            <div>确定要删除这个讲座吗？</div>
            <div>警告：删除操作不可撤销</div>
          </template>
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button type="danger" ghost>
              删除讲座
            </a-button>
          </a-config-provider>
        </a-popconfirm>
      </span>
    </a-table>

    <!-- 添加讲座的modal -->
    <a-modal
      v-model="showingAddLecture"
      title="添加讲座"
      @ok="addLectureConfirm"
      :width=500
    >
      <a-input v-model="newLectureTitle" placeholder="讲座标题" class="adding-input-box"/>
      <a-textarea
        v-model="newLectureContent"
        placeholder="讲座内容"
        :auto-size="{ minRows: 10, maxRows: 10 }"
        class="adding-input-box"
      />
      <a-range-picker
        :ranges="{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }"
        show-time
        format="YY-MM-DD/HH:mm"
        @change="timePickerOnChange"
        class="adding-input-box"
      />
      <a-select mode="tags" style="width: 100%" placeholder="选择讲座地点" @change="handleSelectPosition" class="adding-input-box">
        <a-select-option v-for="position in positions" :key="position.identify">
          {{ position.description }}
        </a-select-option>
      </a-select>

    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api/attendAdmin'
import moment from 'moment'
import { date2String } from '@/util/date'

export default {
  name: 'AttendAdminLectures',
  data () {
    return {
      fetchingLectures: false,
      lectures: [],
      lecturesTableColumn: [
        {
          title: '序号',
          dataIndex: 'index',
          width: '5%'
        },
        {
          title: '讲座名',
          dataIndex: 'title',
          width: '15%'
        },
        {
          title: '开始时间',
          dataIndex: 'start',
          width: '17%'
        },
        {
          title: '结束时间',
          dataIndex: 'end',
          width: '17%'
        },
        {
          title: '位置',
          dataIndex: 'positionStr',
          width: '15%'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      lecturesTablePagination: {
        current: 1,
        pageSize: 20,
        total: 0
      },
      showingAddLecture: false,
      newLectureTitle: '',
      newLectureContent: '',
      newLectureStart: new Date(),
      newLectureEnd: new Date(),
      positions: [],
      newLecturePositions: []
    }
  },
  mounted () {
    this.fetchLectures()
    this.fetchPositions()
  },
  methods: {
    moment,
    handleShowAddLecture () {
      this.showingAddLecture = true
    },
    fetchLectures (params = {}, confirm = undefined | Function) {
      if (Object.keys(params).length === 0) {
        params = this.lecturesTablePagination
      }

      this.fetchingLectures = true
      const pagination = { ...this.lecturesTablePagination }
      const offset = pagination.current - 1 || 0
      const pageSize = pagination.pageSize || 20

      api.getAllLectures({ pageSize, offset })
        .then(res => {
          this.fetchingLectures = false
          this.lecturesTablePagination = {
            total: res.data.count,
            pageSize,
            current: offset + 1
          }
          const lectures = res.data.lectures
          console.log(lectures)
          for (let i = 0; i < lectures.length; i++) {
            lectures[i].index = pageSize * offset + i + 1
            lectures[i].start = date2String(new Date(lectures[i].start))
            lectures[i].end = date2String(new Date(lectures[i].end))
            lectures[i].positionStr = ''
            for (let j = 0; j < lectures[i].positions.length; j++) {
              if (lectures[i].positionStr === '') {
                lectures[i].positionStr = lectures[i].positions[j].description
              } else {
                lectures[i].positionStr += `, ${lectures[i].positions[j].description}`
              }
            }
          }
          this.lectures = lectures
          if (confirm) {
            confirm()
          }
        })
    },
    fetchPositions () {
      api.getAllPositions()
        .then(res => {
          this.positions = res.data.map(m => {
            return {
              ...m,
              identify: m.id.toString()
            }
          })
        })
    },
    deleteLecture (id) {
      api.deleteOneLecture(id)
        .then(() => {
          this.$message.success('删除讲座成功')
          this.fetchLectures()
        })
    },
    handleTableChange () {
      this.fetchLectures()
    },
    addLectureConfirm () {
      if (!this.newLectureTitle) {
        this.$message.error('请填写讲座标题')
      } else if (!this.newLectureContent) {
        this.$message.error('请填写讲座内容')
      } else if (this.newLecturePositions.length === 0) {
        this.$message.error('请选择讲座地点')
      } else {
        api.addOneLecture({
          title: this.newLectureTitle,
          content: this.newLectureContent,
          positions: this.newLecturePositions,
          start: this.newLectureStart,
          end: this.newLectureEnd
        })
          .then(() => {
            this.$message.success('添加讲座成功')
            this.newLectureTitle = ''
            this.newLectureContent = ''
            this.showingAddLecture = false
            this.fetchLectures()
          })
      }
    },
    timePickerOnChange (value) {
      this.newLectureStart = new Date(value[0].valueOf())
      this.newLectureEnd = new Date(value[1].valueOf())
    },
    handleSelectPosition (value) {
      this.newLecturePositions = value.map(m => {
        return parseInt(m)
      })
    }
  }
}
</script>

<style>
.adding-input-box {
  margin: 5px;
}
</style>
