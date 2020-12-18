<template>
  <div>
    <div style="height: 40px">
      <a-row>
        <a-col :span="3" :offset="15">
          <a-button type="primary" icon="lock" @click="handleShowResetAllPassword()">
            重设密码
          </a-button>
        </a-col>
        <a-col :span="3">
          <a-button type="primary" icon="plus" @click="handleShowAddingTeacher()">
            添加老师
          </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- 全部重设密码提示框 -->
    <a-modal
      v-model="showingResetAllPassword"
      title="批量重设密码"
      @ok="resetAllPasswordConfirm"
      @cancel="resetAllPasswordCancel"
      :width=500
    >
      <a-alert type="error" message="你正在批量修改所有老师的密码。请注意，此操作不可撤销" banner />
      <p></p>
      <a-input-password v-model="resetAllPasswordConfirmPass" placeholder="统一新密码"/>
      <p></p>
    </a-modal>

    <!-- 添加老师提示框 -->
    <a-modal
      v-model="showingAddingTeacher"
      title="添加老师"
      @ok="addingTeacherConfirm"
      @cancel="addingTeacherCancel"
      :width=500
    >
      <a-input v-model="addingTeacherConfirmUsername" placeholder="登录账号" class="adding-teacher-input-box"/>
      <a-input-password v-model="addingTeacherConfirmPassword" placeholder="登录密码" class="adding-teacher-input-box"/>
      <a-input v-model="addingTeacherConfirmName" placeholder="姓名" class="adding-teacher-input-box"/>
      <a-input v-model="addingTeacherConfirmEmail" placeholder="邮箱" class="adding-teacher-input-box"/>
      <a-input v-model="addingTeacherConfirmPersonalPage" placeholder="个人主页" class="adding-teacher-input-box"/>
      <a-textarea
        v-model="addingTeacherConfirmResearchArea"
        placeholder="研究领域"
        :auto-size="{ minRows: 2, maxRows: 6 }"
        class="adding-teacher-input-box"
      />
    </a-modal>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */
import * as api from '@/api/attendAdmin'

export default {
  name: 'AttendAdminTeachers',
  data () {
    return {
      showingResetAllPassword: false,
      showingAddingTeacher: false,
      resetAllPasswordConfirmPass: '',
      addingTeacherConfirmUsername: '',
      addingTeacherConfirmPassword: '',
      addingTeacherConfirmName: '',
      addingTeacherConfirmEmail: '',
      addingTeacherConfirmPersonalPage: '',
      addingTeacherConfirmResearchArea: ''
    }
  },
  methods: {
    handleShowResetAllPassword () {
      this.showingResetAllPassword = true
    },
    resetAllPasswordConfirm () {
      if (!this.resetAllPasswordConfirmPass) {
        this.$message.error('请提供必要信息')
      } else {
        api.resetAllPasswordForTeacher(this.resetAllPasswordConfirmPass)
          .then(res => {
            this.$message.success(`所有老师的密码已经统一修改成功（共${res.data.count}名）`)
            this.showingResetAllPassword = false
            this.resetAllPasswordConfirmPass = ''
          })
      }
    },
    resetAllPasswordCancel () {
      this.showingResetAllPassword = false
      this.resetAllPasswordConfirmPass = ''
    },
    handleShowAddingTeacher () {
      this.showingAddingTeacher = true
    },
    addingTeacherCancel () {
      this.addingTeacherConfirmUsername = ''
      this.addingTeacherConfirmPassword = ''
      this.addingTeacherConfirmName = ''
      this.addingTeacherConfirmEmail = ''
      this.addingTeacherConfirmPersonalPage = ''
      this.addingTeacherConfirmResearchArea = ''
      this.showingAddingTeacher = false
    },
    addingTeacherConfirm () {
      if (!this.addingTeacherConfirmUsername || !this.addingTeacherConfirmPassword || !this.addingTeacherConfirmName ||
        !this.addingTeacherConfirmEmail || !this.addingTeacherConfirmPersonalPage || !this.addingTeacherConfirmResearchArea) {
        this.$message.error('请提供必要信息')
      } else {
        api.insertOneTeacher({
          username: this.addingTeacherConfirmUsername,
          password: this.addingTeacherConfirmPassword,
          name: this.addingTeacherConfirmName,
          email: this.addingTeacherConfirmEmail,
          personal_page: this.addingTeacherConfirmPersonalPage,
          research_area: this.addingTeacherConfirmResearchArea
        })
          .then(() => {
            this.$message.success('添加成功')
            this.addingTeacherConfirmUsername = ''
            this.addingTeacherConfirmPassword = ''
            this.addingTeacherConfirmName = ''
            this.addingTeacherConfirmEmail = ''
            this.addingTeacherConfirmPersonalPage = ''
            this.addingTeacherConfirmResearchArea = ''
            this.showingAddingTeacher = false
          })
      }
    }
  }
}
</script>

<style scope>
.adding-teacher-input-box {
  margin: 5px;
}
</style>
