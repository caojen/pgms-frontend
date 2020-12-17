<template>
  <div>
    <div style="height: 40px">
      <a-row>
      <a-col :span="3" :offset="18">
        <a-button type="primary" icon="plus" @click="handleShowAddingStudent()">
          添加学生
        </a-button>
      </a-col>
      <a-col :span="3">
        <a-button type="primary" icon="usergroup-add" @click="handleShowAddingStudents()">
          批量添加
        </a-button>
      </a-col>
    </a-row>

    </div>
    <a-table
      :columns="columns"
      :row-key="record => record.username"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
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
      <template slot="customRender" slot-scope="text, record, index, column">
        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template
            v-for="(fragment, i) in text
              .toString()
              .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
              >{{ fragment }}</mark
            >
            <template v-else>{{ fragment }}</template>
          </template>
        </span>
        <template v-else>
          {{ text }}
        </template>
      </template>

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

    <!-- 添加学生Modal -->
    <a-modal
      v-model="addingStudent"
      title="添加学生"
      @ok="addStudentDone()"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <a-input placeholder="登录账号" v-model="addingStudentInfo.username"/>
      <p></p>
      <a-input-password placeholder="登录密码" v-model="addingStudentInfo.password"/>
      <p></p>
      <a-input placeholder="姓名" v-model="addingStudentInfo.name" />
      <p></p>
      <a-input placeholder="学号" v-model="addingStudentInfo.sid"/>
      <p></p>
      <a-input placeholder="邮箱" v-model="addingStudentInfo.email"/>
      <p></p>
      <a-select
        mode="tags"
        style="width: 100%"
        placeholder="老师姓名"
        @change="addingStudentChangeTeacher"
        @search="addingStudentQueryTeacher"
        :maxTagCount=1
        >
        <a-select-option v-for="value in queryTeachers" :key="value.username">
          {{ value.name }} ( {{value.username}} )
        </a-select-option>
      </a-select>
      <p></p>
    </a-modal>
    <!-- 批量添加学生的Modal -->
    <a-modal v-model="addingStudents" title="批量导入学生" @ok="handleOk()" :maskClosable="false">
      bilibili
    </a-modal>
    <!-- 修改密码的Modal -->
    <a-modal v-model="changingPassword" title="修改密码" @ok="changePasswordConfirm">
      <a-input v-model="changingPasswordUsername" disabled>
        <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
      </a-input>
      <p></p>
      <a-input-password v-model="changingPasswordNewPass" placeholder="新密码">
        <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
      </a-input-password>
    </a-modal>
    <!-- 修改信息的Modal -->
    <a-modal v-model="changingInfo" title="修改信息" @ok="changeInfoConfirm">
      <a-input v-model="changingInfoUsername" disabled>
        <a-icon slot="prefix" type="check" style="color: rgba(0,0,0,.25)" />
      </a-input>
      <p></p>
      <a-input v-model="changingInfoName" placeholder="姓名">
        <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
      </a-input>
      <p></p>
      <a-input v-model="changingInfoSid" placeholder="学号">
        <a-icon slot="prefix" type="search" style="color: rgba(0,0,0,.25)" />
      </a-input>
      <p></p>
      <a-input v-model="changingInfoEmail" placeholder="联系邮箱">
        <a-icon slot="prefix" type="mail" style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-modal>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */
import * as api from '@/api/attendAdmin'

export default {
  name: 'AttendAdminStudents',
  data () {
    return {
      first: true,
      loading: false,
      searchText: '',
      searchInput: null,
      columns: [
        {
          title: '登录账号',
          dataIndex: 'username',
          width: '15%',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) =>
            record.name
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
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
          width: '16%',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) =>
            record.name
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '学号',
          dataIndex: 'student_id',
          width: '15%'
        },
        {
          title: 'Email',
          dataIndex: 'email',
          width: '20%'
        },
        {
          title: 'Actions',
          scopedSlots: { customRender: 'action' }
        }
      ],
      addingStudent: false,
      addingStudents: false,
      addingStudentInfo: {
        username: '',
        password: '',
        name: '',
        email: '',
        sid: '',
        tid: -1
      },

      changingPassword: false,
      changingPasswordUsername: '',
      changingPasswordNewPass: '',
      changingPasswordId: -1,

      changingInfo: false,
      changingInfoId: -1,
      changingInfoUsername: '',
      changingInfoName: '',
      changingInfoEmail: '',
      changingInfoSid: ''
    }
  },
  computed: {
    data () {
      console.log(this.$store.state.attendAdmin.students.length)
      return this.$store.state.attendAdmin.students
    },
    pagination () {
      return this.$store.state.attendAdmin.pagination
    },
    queryTeachers () {
      return this.$store.state.attendAdmin.queryTeachers
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.$store.commit('setPagination', pager)
      this.fetch({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      })
    },
    fetch (params = {}) {
      if (this.first) {
        this.$message.warning('警告：经测试，使用username筛选会出现渲染缺失情况，请尽量使用name筛选', 5)
        this.first = false
      }
      this.loading = true
      const pagination = { ...this.pagination }
      const offset = pagination.current - 1
      const pageSize = pagination.pageSize
      const queryName = params.name ? params.name[0] || '' : ''
      const queryUsername = params.username ? params.username[0] || '' : ''
      this.$store.dispatch('getAllAttendStudents', {
        pageSize,
        offset,
        queryName,
        queryUsername
      })
        .then(() => {
          this.loading = false
        })
    },
    handleSearch (selectedKeys, confirm) {
      confirm()
    },
    handleReset (clearFilters) {
      clearFilters()
    },
    handelOk () {
      this.addingStudent = false
      this.addingStudents = false
    },
    handleShowAddingStudent () {
      this.addingStudent = true
    },
    handleShowAddingStudents () {
      this.addingStudents = true
    },
    addingStudentChangeTeacher (value) {
      console.log('selected: ', value)
      if (value.length > 1) {
        this.$message.error('超过1个老师是未定义行为，将会选择第一个老师')
      }
      if (value.length) {
        // value是老师的username，通过这个username找到id:
        const username = value[0]
        // this.addingStudentInfo.tid = value[0].id
        const queryTeachers = this.queryTeachers
        const result = queryTeachers.filter(t => t.username === username)
        if (result.size === 0) {
          this.addingStudentInfo.tid = -1
        } else {
          this.addingStudentInfo.tid = result[0].id
        }
      } else {
        this.addingStudentInfo.tid = -1
      }
      console.log(this.addingStudentInfo)
    },
    addingStudentQueryTeacher (value) {
      console.log('searching', value)
      this.$store.dispatch('queryTeacherByName', value)
    },
    addStudentDone () {
      const info = this.addingStudentInfo
      if (!info.username || !info.password || !info.email || !info.sid || !info.name) {
        this.$message.error('请填写必须项')
      } else {
        if (info.tid === -1) {
          this.$message.error('请为该学生选择一名老师')
        } else {
          // ok, submit:
          api.addOneAttendStudent(
            info.username,
            info.password,
            info.name,
            info.email,
            info.tid,
            info.sid
          )
            .then(() => {
              this.$message.success('提交成功')
              this.addingStudent = false
              // 重新获得学生列表:
              this.fetch()
            })
        }
      }
    },
    changePassword (info) {
      console.log('change password')
      console.log(info)
      this.changingPasswordUsername = info.username
      this.changingPasswordId = info.id
      this.changingPasswordNewPass = ''
      this.changingPassword = true
    },
    deleteStudent (info) {
      api.deleteOneStudent(info.id)
        .then(() => {
          this.$message.success('已成功删除学生')
          this.fetch()
        })
    },
    changePasswordConfirm () {
      api.changePasswordForStudent(this.changingPasswordId, this.changingPasswordNewPass)
        .then(() => {
          this.changingPasswordNewPass = ''
          this.changingPasswordId = -1
          this.changingPasswordUsername = ''
          this.changingPassword = false
          this.$message.success('修改密码成功')
        })
    },
    changeInfo (info) {
      this.changingInfoId = info.id
      this.changingInfoUsername = info.username
      this.changingInfoEmail = info.email
      this.changingInfoSid = info.student_id
      this.changingInfoName = info.name
      this.changingInfo = true
    },
    changeInfoConfirm () {
      if (!this.changingInfoEmail || !this.changingInfoSid || !this.changingInfoName) {
        this.$message.error('请提供足够的信息')
      } else {
        api.updateStudentInfo(this.changingInfoId, {
          email: this.changingInfoEmail,
          student_id: this.changingInfoSid,
          name: this.changingInfoName
        })
          .then(() => {
            this.changingInfo = false
            this.changingInfoEmail = ''
            this.changingInfoSid = ''
            this.changingInfoName = ''
            this.changingInfoId = -1
            this.$message.success('修改学生信息成功')
            this.fetch()
          })
      }
    }
  }
}
</script>
