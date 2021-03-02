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
                ghost @click="$message.success('已成功选择该学生')"
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

      <a-modal
        v-model="moreInfo"
        title="学生详细信息"
        @ok="() => { record = {}; moreInfo = false; }"
        @cancel="() => { record = {}; moreInfo = false; }"
        :width="700"
      >
        <div>
          <div style="margin-bottom: 10px">
            <img
              v-if="!!record.image"
              :src="`${avatarPrefix}/${record.id}/file/${record.image}`"
              alt="无效的图像格式"
              width="150px"
              height="170px"
            >
            <div id="basic-info" style="font-weight: bold">
              <p>姓名：{{ record.name }}</p>
              <p>学号：{{ record.username }}</p>
              <p>专业：{{ record.degree }}</p>
              <p>类型：{{ record.enrol }}</p>
            </div>
          </div>
          <div style="font-weight: bold" id="more-info">
            <p>联系邮箱：{{ record.email }}</p>
            <p>毕业大学：{{ record.graduation_university }}</p>
            <p>本科学校类型：{{ record.source }}</p>
            <p>本科毕业专业：{{ record.graduation_major }}</p>
            <p>民族：{{ record.ethnic }}</p>
            <p>性别：{{ record.gender }}</p>
            <p>家庭住址：{{ record.household_register }}</p>
            <p>联系方式：{{ record.phone }}</p>
            <p>是否推免：{{ record.recommend ? '是': '否' }}</p>
            <div v-if="files.length > 0">
              文件列表：
              <p v-for="(file, index) in files" :key="index" style="margin-top: 0; margin-bottom: 0;">
                <a-button type="link" @click="download(file)"> {{ file.filename }} </a-button>
              </p>
            </div>
            <div v-else style="color: red">
              该学生未上传文件
            </div>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/teacher'
import { prefix } from '@/util/http'
import { dateFormat } from '@/util/date'
import { openDownloadDialog } from '@/util/fs'

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
      ],
      record: {},
      files: [],
      moreInfo: false,
      avatarPrefix: `${prefix}${api.url.getOneFile}`
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
    },
    gotoMoreInfo (record) {
      this.record = record
      this.moreInfo = true
      if (record.id) {
        api.getFileListOfBistudents(record.id)
          .then(res => {
            this.files = res.data
          })
      }
    },
    download (file) {
      api.getOneFile(this.record.id, file.fid)
        .then(res => {
          const data = res.data
          const blob = new Blob([data])
          openDownloadDialog(blob, file.filename)
        })
    }
  }
}
</script>

<style scoped>
.students-group {
  margin-bottom: 30px;
}
#basic-info {
  position: absolute;
  left: 250px;
  top: 100px;
  font-size: 15px;
}
#more-info p input{
  margin-top: 4px;
  display: inline-block;
  width: 80%;
  right: 0;
}
</style>
