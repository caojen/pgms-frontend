<template>
  <div>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="选择导师"
      :sub-title='`${selectedTeachers.length}/${status.stageCount}`'
    />
    <a-config-provider>
      <template #renderEmpty>
        <div style="text-align: center">
          <p>未选择导师</p>
        </div>
      </template>
      <a-list
        item-layout="horizontal"
        :data-source="order"
        style="font-size: 16px; font-weight: bold; height: 200px"
        :loading="loading"
      >
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-avatar
            style="backgroundColor:#87d068"
            icon="user"
          />
          第 {{ index + 1 }} 志愿导师：
          <a-button type="link"
            @click="showTeacherInfo(item)"
            style="font-size: 16px; font-weight: bold;"
          >
            {{ item.name }}
          </a-button>
          <a-button
            slot="actions" shape="circle" icon="arrow-up"
            v-if="index !== 0"
            @click="orderUp(index)"
          >
          </a-button>
          <a-button
            slot="actions" shape="circle" icon="arrow-down"
            v-if="index !== order.length - 1"
            @click="orderDown(index)"
          >
          </a-button>
        </a-list-item>
      </a-list>
    </a-config-provider>

    <a-table
      :columns="columns"
      :data-source="teachers"
      :row-key="record => record.index"
    >
      <span slot="action" slot-scope="text, record">
        <a-config-provider :auto-insert-space-in-button="false">
          <a-button type="default" @click="showTeacherInfo(record)">
            查看信息
          </a-button>
        </a-config-provider>

        <a-divider type="vertical" v-if="status.choosable && (record.canSelect || record.selected)"/>

        <a-config-provider :auto-insert-space-in-button="false">
          <a-button type="primary" ghost @click="selectTeacher(record)" v-if="status.choosable && record.canSelect">
            选择导师
          </a-button>
          <a-button type="danger" @click="deselectTeacher(record)" v-else-if="status.choosable && record.selected">
            取消选择
          </a-button>
        </a-config-provider>
      </span>
    </a-table>
  </div>
</template>

<script>
import * as api from '@/api/bistudent'

export default {
  name: 'BistudentTeacher',
  data () {
    return {
      loading: false,
      info: {},
      teachers: [],
      selectedTeachers: [],
      status: {},
      order: [],
      columns: [
        { title: '序号', dataIndex: 'index', width: '13%' },
        { title: '导师姓名', dataIndex: 'name', width: '35%' },
        { title: '联系邮箱', dataIndex: 'email', width: '25%' },
        { title: '操作', scopedSlots: { customRender: 'action' } }
      ],
      showingTeacherInfo: false,
      record: {}
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.loading = true
      const pInfo = api.getBistudentInfo()
        .then(res => {
          this.info = res.data
          this.selectedTeachers = JSON.parse(this.info.selected_teachers)
        })
      const pTeacher = api.getAllTeachers()
        .then(res => { this.teachers = res.data })
      const pStatus = api.getBichoiceInfo()
        .then(res => {
          const now = new Date()
          this.status = {
            currentStage: parseInt(JSON.parse(res.data.current_stage).value),
            stageCount: parseInt(JSON.parse(res.data.stage_count).value),
            beginTime: new Date(JSON.parse(res.data.begin_time).value),
            endTime: new Date(JSON.parse(res.data.end_time).value)
          }
          this.status.choosable = this.status.currentStage === 0 && now.getTime() >= this.status.beginTime.getTime() && now <= this.status.endTime.getTime()
          console.log(now.getTime(), this.status.beginTime.getTime(), this.status.endTime.getTime())
        })
      Promise.all([pInfo, pTeacher, pStatus])
        .then(() => {
          // parse seletedTeacher info order
          const canSelect = this.selectedTeachers.length < this.status.stageCount
          const order = []
          for (let index = 0; index < this.teachers.length; index++) {
            this.teachers[index].index = index + 1
            const id = this.teachers[index].id
            if (this.selectedTeachers.indexOf(id) === -1) {
              this.teachers[index].selected = false
              this.teachers[index].canSelect = canSelect
            } else {
              this.teachers[index].selected = true
              this.teachers[index].canSelect = false
              order[this.selectedTeachers.indexOf(id)] = this.teachers[index]
            }
          }
          this.order = order
          this.loading = false
        })
    },
    orderUp (index) {
      api.orderUp(index)
        .then(() => {
          this.$message.success('修改志愿顺序成功')
          this.fetch()
        })
    },
    orderDown (index) {
      api.orderDown(index)
        .then(() => {
          this.$message.success('修改志愿顺序成功')
          this.fetch()
        })
    },
    deselectTeacher (item) {
      const { id } = item
      api.deleteOneTeacher(id)
        .then(() => {
          this.$message.success('取消选择成功')
          this.fetch()
        })
    },
    selectTeacher (item) {
      const { id } = item
      api.selectOneTeacher(id)
        .then(() => {
          this.$message.success('选择导师成功')
          this.fetch()
        })
    },
    showTeacherInfo (record) {
      this.record = record
      this.showingTeacherInfo = true
    }
  }
}
</script>
