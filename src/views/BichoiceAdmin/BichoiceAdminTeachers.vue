<template>
  <div>
    <div style="height: 40px">
      <a-row>
        <a-col :span="3" :offset="18">
          <a-button type="primary" icon="lock" @click="() => showingResetAllPassword = true">
            重设密码
          </a-button>
        </a-col>
        <a-col :span="3">
          <a-button type="primary" icon="plus" @click="addTeacher()">
            添加老师
          </a-button>
        </a-col>
      </a-row>
    </div>

    <a-table
      :columns="columns"
      :row-key="record => record.index"
      :data-source="teachers"
      :loading="loading"
    >
      <span slot="action" slot-scope="text, record">
        <a-config-provider :auto-insert-space-in-button="false">
          <a-button type="primary" ghost @click="changeInfo(record)" style="color: green; border-color: green">
            修改信息
          </a-button>
        </a-config-provider>
        <a-divider type="vertical" />
        <a-config-provider :auto-insert-space-in-button="false">
          <a-button type="primary" ghost @click="changePass(record)" style="color: blue; border-color: blue">
            修改密码
          </a-button>
        </a-config-provider>
        <a-divider type="vertical" />
        <a-config-provider :auto-insert-space-in-button="false">
          <a-button type="primary" ghost @click="changeConfig(record)" style="color: orange; border-color: orange">
            双选配置
          </a-button>
        </a-config-provider>
        <a-divider type="vertical" />
        <a-config-provider :auto-insert-space-in-button="false">
          <a-button type="primary" ghost @click="showSelected(record)" style="color: purple; border-color: purple">
            已选学生
          </a-button>
        </a-config-provider>
        <a-divider type="vertical" />
        <a-config-provider :auto-insert-space-in-button="false">
          <a-button type="primary" ghost @click="selectStudents(record)" style="color: blue; border-color: blue">
            选择学生
          </a-button>
        </a-config-provider>
      </span>
    </a-table>

    <a-modal
      v-model="showingResetAllPassword"
      title="批量重设密码"
      @ok="resetAllPasswordConfirm"
      @cancel="() => showingResetAllPassword = false"
      :width=500
    >
      <a-alert type="error" message="你正在批量修改所有老师的密码。请注意，此操作不可撤销" banner />
      <p></p>
      <a-input-password v-model="resetAllPasswordConfirmPass" placeholder="统一新密码"/>
      <p></p>
    </a-modal>
    <a-modal
      v-model="showingAddingTeacher"
      title="添加老师"
      @ok="addingTeacherConfirm"
      @cancel="() => showingAddingTeacher = false"
      :width=500
    >
      <a-input v-model="insertTeacher.username" placeholder="登录账号" class="info-modal-input" />
      <a-input-password v-model="insertTeacher.password" placeholder="登录密码" class="info-modal-input" />
      <a-input v-model="insertTeacher.name" placeholder="姓名" class="info-modal-input" />
      <a-input v-model="insertTeacher.email" placeholder="邮箱" class="info-modal-input" />
      <a-input v-model="insertTeacher.personal_page" placeholder="个人主页" class="info-modal-input" />
      <a-textarea
        v-model="insertTeacher.research_area"
        placeholder="研究领域"
        :auto-size="{ minRows: 10, maxRows: 10 }"
        class="info-modal-input"
      />
    </a-modal>
    <a-modal
      v-model="showingChangingInfo"
      title="修改信息"
      @ok="changeInfoConfirm"
      @cancel="() => showingChangingInfo = false"
      :width=500
    >
      <a-input v-model="record.username" disabled class="info-modal-input" />
      <a-input v-model="record.name" placeholder="姓名" class="info-modal-input" />
      <a-input v-model="record.email" placeholder="邮箱" class="info-modal-input" />
      <a-input v-model="record.personal_page" placeholder="个人主页" class="info-modal-input" />
      <a-textarea
        v-model="record.research_area"
        placeholder="研究领域"
        :auto-size="{ minRows: 10, maxRows: 10 }"
        class="info-modal-input"
      />
    </a-modal>
    <a-modal
      title="修改密码"
      v-model="showingChangingPass"
      @ok="changePassConfirm"
      @cancel="() => showingChangingInfo = false"
      :width=500
    >
      <a-input v-model="record.username" disabled class="info-modal-input" />
      <a-input-password v-model="newPass" placeholder="新的密码"/>
    </a-modal>
    <a-modal
      title="双选配置"
      v-model="showingChangingConfig"
      @ok="changeConfigConfirm"
      @cancel="() => showingChangingConfig = false"
      :width=600
    >
      <a-collapse>
        <a-collapse-panel key="1" header="Enrol">
          <a-button
            type="link"
            @click="() => enrols.push({id: '', num: 0})"
            style = "margin-bottom: 10px; float: right"
          >
            添加项
          </a-button>

          <div v-for="(item, index) in enrols" :key="index" style="margin-bottom: 10px">
            <a-select
              :default-value="item.id"
              style="width: 300px"
              @change="value => item.id=value"
            >
              <a-select-option v-for="(i, ind) in allEnrols" :key="ind" :value="i.id">
                {{ i.description }}
              </a-select-option>
            </a-select>

            <a-input-number
              v-model="item.num"
              :min=0
              :max=1000
              style="margin-left: 20px"
            >
            </a-input-number>
          </div>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="Degree">
          <a-button
            type="link"
            @click="() => degrees.push({id: '', num: 0})"
            style = "margin-bottom: 10px; float: right"
          >
            添加项
          </a-button>

          <div v-for="(item, index) in degrees" :key="index" style="margin-bottom: 10px">
            <a-select
              :default-value="item.id"
              style="width: 300px"
              @change="value => item.id=value"
            >
              <a-select-option v-for="(i, ind) in allDegrees" :key="ind" :value="i.degree_id">
                {{ i.degree_description }} {{ i.enrol_description }}
              </a-select-option>
            </a-select>

            <a-input-number
              v-model="item.num"
              :min=0
              :max=1000
              style="margin-left: 20px"
            >
            </a-input-number>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </a-modal>

    <a-modal
      title="已选择学生"
      v-model="showingSelected"
      @ok="() => showingSelected = false"
      v-if="showingSelected"
      :width=1200
    >
      <a-collapse>
        <a-collapse-panel v-for="stage of settings.stage_count" :key="stage" :header="`第${stage}阶段`">
          <a-table
            :columns="studentColumns"
            :row-key="record => record.index"
            :data-source="record.selected_students[stage-1]"
          >
          </a-table>
        </a-collapse-panel>
      </a-collapse>
    </a-modal>

    <a-modal
      title="选择学生"
      v-model="showingSelectStudents"
      @ok="() => { showingSelectStudents = false; fetch() }"
      @cancel="fetch"
      :width=1200
    >
      <a-collapse>
        <a-collapse-panel v-for="stage of settings.stage_count" :key="stage" :header="`第${stage}阶段`">
          <a-table
            :columns="showStudentsColumns"
            :data-source="showStudents[stage-1]"
            :row-key="record => record.id"
            :loading="loadingShowStudents"
          >
            <span slot="action" slot-scope="text, record">
              <a-config-provider :auto-insert-space-in-button="false">
                <a-button
                  type="primary"
                  style="background-color: green; border-color: green"
                  v-if="!record.canSelect && record.selected"
                  @click="() => $message.success('该学生已选择')"
                >
                  学生已选择
                </a-button>
                <a-button
                  type="primary"
                  style="background-color: blue; border-color: blue"
                  v-else-if="record.canSelect && !record.selected"
                  @click="select(record.id)"
                >
                  选择
                </a-button>
                <a-button
                  type="primary"
                  style="background-color: red; border-color: red"
                  v-else-if="record.canSelect && record.selected"
                  @click="deselect(record.id)"
                >
                  取消选择
                </a-button>
                <a-button
                  type="primary"
                  style="background-color: #C0C0C0; border-color: #C0C0C0"
                  @click="() => $message.error('不在选择阶段内，或可选名额已满')"
                >
                  无法选择
                </a-button>
              </a-config-provider>
            </span>
          </a-table>
        </a-collapse-panel>
      </a-collapse>
    </a-modal>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */

import * as api from '@/api/bichoiceAdmin'

export default {
  name: 'BichoiceAdminTeachers',
  data () {
    return {
      settings: {},
      showingResetAllPassword: false,
      resetAllPasswordConfirmPass: '',
      showingAddingTeacher: false,
      insertTeacher: {
        username: '',
        password: '',
        name: '',
        personal_page: '',
        research_area: '',
        email: ''
      },
      loading: false,
      teachers: [],
      columns: [
        { title: '序号', dataIndex: 'index', width: '8%' },
        // { title: '登录账号', dataIndex: 'username', width: '13%' },
        { title: '姓名', dataIndex: 'name', width: '15%' },
        { title: '邮箱', dataIndex: 'email', width: '15%' },
        { title: '已选择', dataIndex: 'students_count', width: '12%' },
        { title: '操作', scopedSlots: { customRender: 'action' } }
      ],
      record: {},
      showingChangingInfo: false,
      showingChangingPass: false,
      newPass: '',
      showingChangingConfig: false,
      enrols: [],
      degrees: [],
      showingSelected: false,
      showingSelectStudents: false,
      allEnrols: [],
      allDegrees: [],
      studentColumns: [
        { title: '序号', dataIndex: 'index', width: '8%' },
        { title: '姓名', dataIndex: 'name', width: '20%' },
        { title: '登录账号', dataIndex: 'username', width: '20%' },
        { title: '学生类型', dataIndex: 'degree', width: '20%' },
        { title: '', dataIndex: 'enrol', width: '20%' }
      ],
      loadingShowStudents: false,
      showStudents: [],
      showStudentsColumns: [
        { title: '序号', dataIndex: 'id', width: '10%' },
        { title: '姓名', dataIndex: 'name', width: '20%' },
        { title: '登录账号', dataIndex: 'username', width: '20%' },
        { title: '学生类型', dataIndex: 'degree', width: '15%' },
        { title: '', dataIndex: 'enrol', width: '15%' },
        { title: '操作', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    resetAllPasswordConfirm () {
      api.resetAllBiTeacherPassword(this.resetAllPasswordConfirmPass)
        .then(() => {
          this.$message.success('修改成功')
          this.showingResetAllPassword = false
        })
    },
    addingTeacherConfirm () {
      api.addBiTeacher(this.insertTeacher)
        .then(() => {
          this.$message.success('添加老师成功')
          this.showingAddingTeacher = false
          this.fetch()
        })
    },
    fetch () {
      this.loading = true
      api.getAllBiTeachers()
        .then(res => {
          this.teachers = res.data.map(r => {
            return {
              ...r,
              index: res.data.indexOf(r) + 1
            }
          })
          this.loading = false
        })
      api.getEnrols()
        .then(res => {
          this.allEnrols = res.data
        })
      api.getDegrees()
        .then(res => {
          this.allDegrees = res.data
        })
      api.getSettings()
        .then(res => {
          res.data.forEach(value => {
            this.settings[value.key] = JSON.parse(value.value).value
          })
        })
    },
    addTeacher () {
      this.showingAddingTeacher = true
      this.insertTeacher = {
        username: '',
        password: '',
        name: '',
        personal_page: '',
        research_area: '',
        email: ''
      }
    },
    changeInfo (record) {
      this.record = { ...record }
      this.showingChangingInfo = true
    },
    changePass (record) {
      this.record = { ...record }
      this.showingChangingPass = true
    },
    changeConfig (record) {
      this.record = { ...record }
      this.showingChangingConfig = true

      if (this.record.bichoice_config.enrols) {
        this.enrols = [...this.record.bichoice_config.enrols]
      } else {
        this.enrols = []
      }

      if (this.record.bichoice_config.degrees) {
        this.degrees = [...this.record.bichoice_config.degrees]
      } else {
        this.degrees = []
      }
    },
    showSelected (record) {
      this.showingSelected = true
      const id = record.id
      this.record = record
      this.record.selected_students = []
      api.getTeacherSelectedBistudents(id)
        .then(res => {
          this.record.selected_students = res.data
        })
    },
    selectStudents (record = this.record) {
      const id = record.id
      this.record = record
      this.showingSelectStudents = true
      this.loadingShowStudents = true
      api.getBistudentForTeacher(id)
        .then(res => {
          this.$set(this, 'showStudents', res.data)
          this.loadingShowStudents = false
        })
    },
    changeInfoConfirm () {
      const record = this.record
      this.showingChangingInfo = false
      api.changeTeacherInfo(record.id, {
        name: record.name,
        email: record.email,
        research_area: record.research_area,
        personal_page: record.personal_page
      })
        .then(() => {
          this.$message.success('修改成功')
          this.fetch()
          this.showingChangingInfo = false
        })
    },
    changePassConfirm () {
      const id = this.record.id
      const pass = this.newPass
      api.changeTeacherPassword(id, pass)
        .then(() => {
          this.$message.success('修改密码成功')
          this.fetch()
          this.showingChangingPass = false
        })
    },
    changeConfigConfirm () {
      const id = this.record.id
      const enrols = this.enrols
      const degrees = this.degrees

      // 判断有没有冲突，如果有，那么报错:
      let arr = []
      console.log(enrols, degrees)
      for (let i = 0; i < enrols.length; i++) {
        if (arr.indexOf(enrols[i]?.id) !== -1 || enrols[i]?.id === '' || enrols[i].num < 0) {
          this.$message.error('上传失败：请检查是否有重复的键、键是否合法、值是否为非负整数')
          return
        } else {
          arr.push(enrols[i].id)
        }
      }

      arr = []
      for (let i = 0; i < degrees.length; i++) {
        if (arr.indexOf(degrees[i]?.id) !== -1 || degrees[i]?.id === '' || degrees[i].num < 0) {
          this.$message.error('上传失败：请检查是否有重复的键、键是否合法、值是否为非负整数')
          return
        } else {
          arr.push(degrees[i].id)
        }
      }
      Promise.all([
        api.updateTeacherEnrols(id, enrols),
        api.updateTeacherDegrees(id, degrees)
      ])
        .then(() => {
          this.$message.success('修改成功')
          this.showingChangingConfig = false
          this.fetch()
        })
    },
    select (bisid) {
      this.loadingShowStudents = true
      api.selectBistudentForTeacher(this.record.id, bisid)
        .then(() => {
          this.$message.success('选择成功')
          this.selectStudents()
        })
    },
    deselect (bisid) {
      this.loadingShowStudents = true
      api.deleteBistudentForTeacher(this.record.id, bisid)
        .then(() => {
          this.$message.success('取消选择成功')
          this.selectStudents()
        })
    }
  }
}
</script>

<style>

.info-modal-input {
  margin-bottom: 12px;
}

</style>
