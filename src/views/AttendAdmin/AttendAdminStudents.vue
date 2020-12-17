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
    <a-modal
      v-model="addingStudents"
      title="批量导入学生"
      @ok="addingStudentsDone()"
      :maskClosable="false"
      :width=1000
    >
      <div>
        <a-steps :current="current">
          <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>
        <div class="steps-content">
          <div v-if="current===0">
            <p>首先，请准备学生的以下信息：</p>
            <ul>
              <li>登录账号（可以直接用学号）</li>
              <li>登录密码（不为空即可）</li>
              <li>学生姓名</li>
              <li>学生的联系邮箱</li>
              <li>学生学号</li>
              <li>学生对应的老师的登录账号（不能为空）</li>
            </ul>
            <p>然后，<a-button @click="downloadTemplate" type="link">点击这里</a-button>下载模版</p>
            <p>根据下载的模版，填充相关的信息，然后点击下面的按钮进入下一步</p>
          </div>
          <div v-if="current===1">
            <p>请点击下面的按钮选择填充好的模版文件</p>
            <p>选择文件后，请点击“解析”按钮对文件进行解析</p>
            <p>等待解析完成后（进度条显示100%），点击继续进入下一步</p>
            <a-upload :file-list="fileList" :remove="removeFile" :before-upload="beforeUploadFile">
              <a-button> <a-icon type="upload" /> 选择模版文件 </a-button>
            </a-upload>
            <p></p>
            <div>
              <div>
                <a-button :disabled="fileList.length === 0" @click="resolveTemplate"> 解析 </a-button>
              </div>
              <p></p>
              <a-progress
                :percent="parsePercent"
                status="active"
                style="width: 97%"
                :stroke-color="{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }"
              />
            </div>
          </div>
        </div>
        <div class="steps-action">
          <a-button v-if="current < steps.length - 1" type="primary" @click="() => current++">
            继续
          </a-button>
          <a-button
            v-if="current == steps.length - 1"
            type="primary"
            @click="$message.success('Processing complete!')"
          >
            完成
          </a-button>
          <a-button v-if="current > 0" style="margin-left: 8px" @click="current--">
            撤销
          </a-button>
        </div>
      </div>
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
/* eslint-disable no-proto */
import * as api from '@/api/attendAdmin'
import * as xlsx from 'xlsx'
import { book2blob, openDownloadDialog } from '@/util/fs'

export default {
  name: 'AttendAdminStudents',
  data () {
    return {
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
      changingInfoSid: '',

      current: 0,
      steps: [
        // content未使用，通过v-if写在html里面了
        {
          title: '填充模版',
          content: '你需要填充一个含有学生信息的模版'
        },
        {
          title: '上传模版',
          content: '将已经写好的模版上传'
        },
        {
          title: '预览',
          content: '通过解析模版，你可以看到学生的大致信息'
        },
        {
          title: '上传',
          content: '学生信息上传到服务器'
        }
      ],
      fileList: [],
      studentsInfo: [],
      parsePercent: 0
    }
  },
  computed: {
    data () {
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
    },
    addingStudentQueryTeacher (value) {
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
    },
    downloadTemplate () {
      const template = [
        ['登录账号', '密码', '姓名', '学号', '联系邮箱', '老师的联系方式']
      ]
      const sheet = xlsx.utils.aoa_to_sheet(template)
      const workbook = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(workbook, sheet, 'sheet1')
      openDownloadDialog(book2blob(workbook), 'template.xlsx')
    },
    removeFile (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUploadFile (file) {
      if (this.fileList.length >= 1) {
        this.$message.error('只需要上传一个模版文件即可，将鼠标放在文件名上面就可以看到删除按钮')
      } else {
        this.fileList = [...this.fileList, file]
      }
      return false
    },
    resolveTemplate () {
      const file = this.fileList[0]
      const reader = new FileReader()
      reader.onload = () => {
        const content = reader.result
        const workbook = xlsx.read(content, { type: 'array' })
        const sheet = workbook.Sheets.sheet1
        const json = xlsx.utils.sheet_to_json(sheet)
        const size = json.length
        const parseResult = []
        for (let i = 0; i < size; i++) {
          this.parsePercent = parseInt(i * 1.0 / size * 100)
          const username = json[i]['登录账号']
          const password = json[i]['密码']
          const name = json[i]['姓名']
          const sid = json[i]['学号']
          const email = json[i]['联系邮箱']
          const tusername = json[i]['老师的联系方式']
          parseResult.push({
            username,
            password,
            name,
            email,
            student_id: sid,
            teacher_username: tusername
          })
        }
        this.parsePercent = 100
        this.studentsInfo = parseResult
      }
      reader.readAsArrayBuffer(file)
    }
  }
}
</script>

<style scoped>
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 300px;
  padding-top: 10px;
  padding-left: 30px;
}
.steps-action {
  margin-top: 24px;
}
</style>
