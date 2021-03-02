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
        <span v-else-if="status.currentStage <= status.stageCount">
          导师选择阶段
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
    <div id="step-part">
      <div class="summary-part">
        <span> 双选流程 </span>
      </div>
      <a-steps :current="currentStep">
        <a-step title="上传资料" description="请在本阶段通过左侧的文件上传界面上传必要的资料，并通过我的信息界面查看并完善个人信息"></a-step>
        <a-step title="学生选择导师" description="在本阶段中你可以选择导师"></a-step>
        <a-step title="导师选择学生" description="导师将在本阶段中选择学生"></a-step>
        <a-step title="双选结束"></a-step>
      </a-steps>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/bistudent'
import { dateFormat } from '@/util/date'

export default {
  name: 'BistudentHome',
  data () {
    return {
      status: {}
    }
  },
  computed: {
    currentStep () {
      const currentStage = this.status.currentStage
      if (currentStage === undefined) {
        return 0
      } else {
        if (currentStage === -1) {
          return 0
        } else if (currentStage === 0) {
          return 1
        } else if (currentStage < this.tatus.stageCount) {
          return 2
        } else {
          return 3
        }
      }
    }
  },
  mounted () {
    api.getBichoiceInfo()
      .then(res => {
        this.status = {
          currentStage: parseInt(JSON.parse(res.data.current_stage).value),
          stageCount: parseInt(JSON.parse(res.data.stage_count).value),
          beginTime: dateFormat('YY-mm-dd HH:MM:SS', new Date(JSON.parse(res.data.begin_time).value)),
          endTime: dateFormat('YY-mm-dd HH:MM:SS', new Date(JSON.parse(res.data.end_time).value))
        }
      })
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

#step-part {
  width: 95%;
  margin: 0 auto;
  margin-top: 10%;
}
</style>
