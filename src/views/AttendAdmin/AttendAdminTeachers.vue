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

        <a-popconfirm
          title="确定要删除这个学生吗？此操作不可恢复"
          ok-text="Yes"
          cancel-text="No"
          @confirm="deleteStudent(record)"
        >
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button type="danger" ghost>
              删除学生
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
          width: '10%',
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
      }
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
          })
      }
    },
    fetchShowingTeachers (params = {}, confirm = undefined | Function) {
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
          console.log(this.showingTeachers)
          console.log(this.showingTeachersTablePagination)
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
    }
  }
}
</script>

<style scope>
.adding-teacher-input-box {
  margin: 5px;
}
</style>
