<template>
  <div>
    <div v-if="status.currentStage <= 0">
      <a-alert
        message="阶段未开始"
        description="老师选择阶段未开始，因此未展示数据"
        type="error"
        show-icon
      />
      <a-empty style="margin-top: 50px" description="没有数据"></a-empty>
    </div>

    <div v-else>
      <div v-for="(stage, key) in students" :key="key" class="students-group">
        <a-alert :message='`第${key + 1}阶段可选列表`' type="info" style="margin-bottom: 4px"></a-alert>
        <a-table
          :columns="columns"
          :row-key="record => record.username"
          :data-source="students[key]"
          :loading="loading"
        >
          <span slot="action" slot-scope="text, record">
            <a-config-provider :auto-insert-space-in-button="false">
              <a-button type="primary" ghost @click="gotoMoreInfo(record)">
                更多信息
              </a-button>
            </a-config-provider>
            <a-divider type="vertical" />
            <a-config-provider :auto-insert-space-in-button="false">
              <a-button
                type="primary"
                ghost @click="$message.success('该学生已成功选择')"
                style="color: green; border-color: green;"
                v-if="record.selected && !record.canSelect"
              >
                已选择
              </a-button>
              <a-button
                type="primary"
                ghost @click="select(record)"
                v-else-if="!record.selected && record.canSelect"
              >
                选择学生
              </a-button>
              <a-button
                type="primary"
                ghost @click="deselect(record)"
                v-else-if="record.selected && record.canSelect"
                style="color: red; border-color: red"
              >
                取消选择
              </a-button>
              <a-tooltip v-else title="不在选择阶段，或没有足够名额">
                <a-button
                  type="primary"
                  ghost
                  disabled
                >
                  不可选择
                </a-button>
              </a-tooltip>
            </a-config-provider>
          </span>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/teacher'
import { dateFormat } from '@/util/date'

export default {
  name: 'TeacherBichoice',
  data () {
    return {
      loading: false,
      status: {},
      students: [],
      columns: [
        { title: '姓名', dataIndex: 'name', width: '15%' },
        { title: '学号', dataIndex: 'username', width: '15%' },
        { title: '专业', dataIndex: 'degree', width: '25%' },
        { title: '注册类型', dataIndex: 'enrol', width: '20%' },
        { title: '操作', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  mounted () {
    api.getStatus()
      .then(res => {
        this.status = {
          currentStage: parseInt(JSON.parse(res.data.current_stage).value),
          stageCount: parseInt(JSON.parse(res.data.stage_count).value),
          beginTime: dateFormat('YY-mm-dd HH:MM:SS', new Date(JSON.parse(res.data.begin_time).value)),
          endTime: dateFormat('YY-mm-dd HH:MM:SS', new Date(JSON.parse(res.data.end_time).value))
        }

        if (this.status.stageCount > 0) {
          this.fetch()
        }
      })
  },
  methods: {
    fetch () {
      this.loading = true
      api.getBistudents().then(res => {
        this.students = res.data
        this.loading = false
      })
    },
    select (record) {
      const id = record.id
      api.selectBistudents(id)
        .then(() => {
          this.$message.success('选择成功')
          this.fetch()
        })
    },
    deselect (record) {
      const id = record.id
      api.deleteBistudents(id)
        .then(() => {
          this.$message.success('取消选择成功')
          this.fetch()
        })
    }
  }
}
</script>

<style scoped>
.students-group {
  margin-bottom: 30px;
}
</style>
