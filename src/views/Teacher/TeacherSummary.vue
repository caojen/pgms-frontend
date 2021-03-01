<template>
  <div>
    <div class="summary-part">
      <div>
        <span v-if="status.currentStage === -1">
          学生上传资料阶段
        </span>
        <span v-else-if="status.currentStage === 0">
          学生选择阶段
        </span>
        <span v-else-if="status.currentStage < status.stageCount">
          导师选择第 {{ status.currentStage }} 阶段
        </span>
        <span v-else>
          已结束
        </span>
      </div>
      <span id="datetime-part">
        {{ status.beginTime }}
        ~
        {{ status.endTime }}
      </span>
    </div>

    <a-table
      :columns="enrolsColumns"
      :row-key="record => record.description"
      :data-source="enrols"
      :loading="loading"
    >
    </a-table>

    <a-table
      :columns="degreeColumns"
      :row-key="record => `${record.degree_description}-${record.enrol_description}`"
      :data-source="degrees"
      :loading="loading"
    ></a-table>
  </div>
</template>

<script>
import * as api from '@/api/teacher'
import { dateFormat } from '@/util/date'

export default {
  name: 'TeacherSummary',
  data () {
    return {
      loading: false,
      enrols: [],
      degrees: [],
      status: {},
      enrolsColumns: [
        {
          title: '注册类型',
          dataIndex: 'description',
          width: '50%'
        },
        {
          title: '已选数量',
          dataIndex: 'count',
          width: '20%'
        },
        {
          title: '限选数量',
          dataIndex: 'num',
          width: '30%'
        }
      ],
      degreeColumns: [
        {
          title: '专业',
          dataIndex: 'degree_description',
          width: '30%'
        },
        {
          title: '注册类型',
          dataIndex: 'enrol_description',
          width: '20%'
        },
        {
          title: '已选数量',
          dataIndex: 'count',
          width: '20%'
        },
        {
          title: '限选数量',
          dataIndex: 'num',
          width: '30%'
        }
      ]
    }
  },
  mounted () {
    this.loading = true
    Promise.all([
      api.getDegrees()
        .then(res => { this.degrees = res.data }),
      api.getEnrols()
        .then(res => { this.enrols = res.data }),
      api.getStatus()
        .then(res => {
          this.status = {
            currentStage: parseInt(JSON.parse(res.data.current_stage).value),
            stageCount: parseInt(JSON.parse(res.data.stage_count).value),
            beginTime: dateFormat('YY-mm-dd HH:MM:SS', new Date(JSON.parse(res.data.begin_time).value)),
            endTime: dateFormat('YY-mm-dd HH:MM:SS', new Date(JSON.parse(res.data.end_time).value))
          }
        })
    ])
      .then(() => { this.loading = false })
  }
}
</script>

<style scoped>
.summary-part {
  text-align: center;
  font-size: 25px;
  margin-bottom: 20px;
}
.summary-part span {
  font-weight: bolder;
  color: blue;
}
#datetime-part {
  font-size: 22px;
  font-weight: bold;
  color: red;
}
</style>
