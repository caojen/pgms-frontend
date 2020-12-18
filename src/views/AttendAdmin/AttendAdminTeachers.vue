<template>
  <div>
    <div style="height: 40px">
      <a-row>
        <a-col :span="3" :offset="18">
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

    <a-table
      :columns="showingTeachersColumns"
      :row-key="record => record.index"
      :data-source="showingTeachers"
      :pagination="showingTeachersTablePagination"
      :loading="fetchingShowTeachers"
      @change="handleTableChange"
    >
      <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        style="padding: 8px"
      >
        <a-input
          v-ant-ref="c => (searchInput = c)"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block;"
          @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
          type="primary"
          icon="search"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          搜索
        </a-button>
        <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
          清空
        </a-button>
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <span slot="action" slot-scope="text, record">
        <a-config-provider :auto-insert-space-in-button="false">
          <a-button type="primary" ghost @click="changePassword(record)">
            修改密码
          </a-button>
        </a-config-provider>
        <a-divider type="vertical" />
        <a-config-provider :auto-insert-space-in-button="false">
          <a-button type="primary" ghost @click="changeInfo(record)" style="color: green; border-color: green">
            修改信息
          </a-button>
        </a-config-provider>
        <a-divider type="vertical" />
        <a-config-provider :auto-insert-space-in-button="false">
          <a-button type="primary" ghost @click="toShowStudents(record)" style="color: brown; border-color: brown">
            查看学生
          </a-button>
        </a-config-provider>
        <a-divider type="vertical" />

        <a-popconfirm
          ok-text="确认删除"
          cancel-text="取消"
          @confirm="deleteTeacher(record.id)"
          style="max-width: 30%"
        >
          <template slot="title">
            <div>确定要删除这个老师吗？</div>
            <div>请注意，由于级联，该老师的所有学生都会被删除</div>
            <div>如果需要，请首先将该老师的学生备份</div>
            <div>警告：删除操作不可撤销</div>
          </template>
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button type="danger" ghost>
              删除老师
            </a-button>
          </a-config-provider>
        </a-popconfirm>
      </span>
    </a-table>

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

    <!-- 修改老师密码提示框 -->
    <a-modal
      v-model="showingChangeTeacherPassword"
      title="修改老师密码"
      @ok="changeTeacherPasswordConfirm"
      @cancel="changeTeacherPasswordConfirm"
      :width=500
    >
      <div>
        <a-input v-model="changeTeacherPasswordUsername" disabled/>
        <p></p>
        <a-input-password v-model="changeTeacherPasswordConfirmPass" placeholder="新密码"/>
      </div>
    </a-modal>
    <!-- 修改老师信息提示框 -->
    <a-modal
      v-model="showingChangeInfo"
      title="修改老师信息"
      @ok="changeInfoConfirm"
      @cancel="changeInfoCancel"
      :width=500
    >
      <a-input v-model="changeInfoUsername" placeholder="登录账号" class="adding-teacher-input-box" disabled/>
      <a-input v-model="changeInfoName" placeholder="姓名" class="adding-teacher-input-box"/>
      <a-input v-model="changeInfoEmail" placeholder="邮箱" class="adding-teacher-input-box"/>
      <a-input v-model="changeInfoPersonalPage" placeholder="个人主页" class="adding-teacher-input-box"/>
      <a-textarea
        v-model="changeInfoResearchArea"
        placeholder="研究领域"
        :auto-size="{ minRows: 2, maxRows: 6 }"
        class="adding-teacher-input-box"
      />
    </a-modal>
    <!-- 展示学生提示框 -->
    <a-modal
      v-model="showingStudents"
      :title="`查看 ${showStudentTUsername} 学生`"
      @ok="() => showingStudents = false"
      :width=1000
      :footer="null"
    >
      <a-table
        :columns="showingStudentsColumn"
        :row-key="record => record.index"
        :data-source="showStudents"
        :pagination="showStudentsTablePagination"
        :loading="fetchingStudents"
        @change="handleShowStudentTableChange"
      >
      </a-table>
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
      addingTeacherConfirmResearchArea: '',
      showingTeachersColumns: [
        {
          title: '序号',
          dataIndex: 'index',
          width: '8%'
        },
        {
          title: '登录账号',
          dataIndex: 'username',
          width: '15%',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: '15%',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '联系邮箱',
          dataIndex: 'email',
          width: '20%'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      fetchingShowTeachers: true,
      showingTeachers: [],
      showingTeachersTablePagination: {
        current: 1,
        pageSize: 20,
        total: 0
      },
      showingChangeTeacherPassword: false,
      changeTeacherPasswordId: -1,
      changeTeacherPasswordUsername: '',
      changeTeacherPasswordConfirmPass: '',
      showingChangeInfo: false,
      changeInfoId: -1,
      changeInfoUsername: '',
      changeInfoName: '',
      changeInfoEmail: '',
      changeInfoPersonalPage: '',
      changeInfoResearchArea: '',
      showingStudents: false,
      showStudentTid: -1,
      showStudentTUsername: '',
      showStudents: [],
      showStudentsAll: [],
      showStudentsTablePagination: {
        current: 1,
        pageSize: 7,
        total: 0
      },
      fetchingStudents: true,
      showingStudentsColumn: [
        {
          title: '序号',
          dataIndex: 'index',
          width: '10%'
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: '20%'
        },
        {
          title: '学号',
          dataIndex: 'student_id',
          width: '20%'
        },
        {
          title: '联系邮箱',
          dataIndex: 'email'
        }
      ]
    }
  },
  mounted () {
    this.fetchShowingTeachers()
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
            this.fetchShowingTeachers()
          })
      }
    },
    fetchShowingTeachers (params = {}, confirm = undefined | Function) {
      if (Object.keys(params).length === 0) {
        params = this.showingTeachersTablePagination
      }

      this.fetchingShowTeachers = true
      const pagination = { ...this.showingTeachersTablePagination }
      const offset = pagination.current - 1 || 0
      const pageSize = pagination.pageSize || 20
      const queryName = params.name ? params.name[0] || '' : ''
      const queryUsername = params.username ? params.username[0] || '' : ''
      api.getAllTeachers(pageSize, offset, queryName, queryUsername)
        .then(res => {
          const data = res.data
          const count = data.count
          const teachers = []
          for (let i = 0; i < data.teachers.length; i++) {
            teachers[i] = {
              ...data.teachers[i],
              index: i + 1 + pageSize * offset
            }
          }
          this.showingTeachers = teachers
          this.showingTeachersTablePagination = {
            total: count,
            pageSize,
            current: offset + 1
          }
          this.fetchingShowTeachers = false
          if (confirm) {
            confirm()
          }
        })
    },
    handleSearch (selectedKeys, confirm) {
      confirm()
    },
    handleReset (clearFilters) {
      clearFilters()
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.showingTeachersTablePagination }
      pager.current = pagination.current
      this.showingTeachersTablePagination = pager
      this.fetchShowingTeachers({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      })
    },
    deleteTeacher (tid) {
      api.deleteOneTeacher(tid)
        .then(() => {
          this.$message.success('删除老师成功')
          this.fetchShowingTeachers()
        })
    },
    changeTeacherPasswordConfirm () {
      if (this.changeTeacherPasswordConfirmPass === '') {
        this.$message.error('请提供有效信息')
      } else {
        api.changePasswordForTeacher(this.changeTeacherPasswordId, this.changeTeacherPasswordConfirmPass)
          .then(() => {
            this.showingChangeTeacherPassword = false
            this.changeTeacherPasswordId = -1
            this.changeTeacherPasswordConfirmPass = ''
            this.changeTeacherPasswordUsername = ''
            this.$message.success('修改成功')
          })
      }
    },
    changePassword (record) {
      this.changeTeacherPasswordId = record.id
      this.changeTeacherPasswordUsername = record.username
      this.changeTeacherPasswordConfirmPass = ''
      this.showingChangeTeacherPassword = true
    },
    changeInfo (record) {
      this.changeInfoId = record.id
      this.changeInfoUsername = record.username
      this.changeInfoName = record.name
      this.changeInfoEmail = record.email
      this.changeInfoPersonalPage = record.personal_page
      this.changeInfoResearchArea = record.research_area

      this.showingChangeInfo = true
    },
    changeInfoConfirm () {
      if (!this.changeInfoUsername || !this.changeInfoName ||
        !this.changeInfoEmail || !this.changeInfoPersonalPage || !this.changeInfoResearchArea) {
        this.$message.error('请提供必要信息')
      } else {
        api.updateOneTeacher(this.changeInfoId, {
          name: this.changeInfoName,
          research_area: this.changeInfoResearchArea,
          personal_page: this.changeInfoPersonalPage,
          email: this.changeInfoEmail
        })
          .then(() => {
            this.$message.success('修改信息成功')
            this.changeInfoId = -1
            this.changeInfoUsername = ''
            this.changeInfoName = ''
            this.changeInfoEmail = ''
            this.changeInfoPersonalPage = ''
            this.changeInfoResearchArea = ''
            this.showingChangeInfo = false
            this.fetchShowingTeachers()
          })
      }
    },
    changeInfoCancel () {
      this.showingChangeInfo = false
      this.changeInfoId = -1
      this.changeInfoUsername = ''
      this.changeInfoName = ''
      this.changeInfoEmail = ''
      this.changeInfoPersonalPage = ''
      this.changeInfoResearchArea = ''
      this.showingChangeInfo = false
    },
    toShowStudents (record) {
      this.showingStudents = true
      this.showStudentTid = record.id
      this.showStudentTUsername = record.name
      this.fetchStudents()
    },
    fetchStudents () {
      this.fetchingStudents = true
      const tid = this.showStudentTid
      api.getOneTeacherInfo(tid)
        .then(res => {
          const students = res.data.students
          for (let i = 0; i < students.length; i++) {
            students[i].index = i + 1
          }
          const count = res.data.students.length
          const pager = { ...this.showStudentsTablePagination }
          pager.total = count
          pager.current = 1
          this.showStudentsTablePagination = pager
          this.showStudentsAll = students
          this.showStudents = this.showStudentsAll.slice(0, pager.pageSize)
          this.fetchingStudents = false
        })
    },
    handleShowStudentTableChange (pagination) {
      const pager = { ...this.showStudentsTablePagination }
      pager.current = pagination.current
      this.showStudentsTablePagination = pager
      this.showStudents = this.showStudentsAll.slice(pager.pageSize * (pager.current - 1), pager.pageSize * pager.current)
    }
  }
}
</script>

<style scope>
.adding-teacher-input-box {
  margin: 5px;
}
</style>
