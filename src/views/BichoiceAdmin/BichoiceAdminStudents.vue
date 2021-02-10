<template>
  <div>
    <div style="height: 40px">
      <a-row>
        <a-col :span="3" :offset="18">
          <a-button type="primary" icon="plus" @click="() => addingStudents = true">
            添加学生
          </a-button>
        </a-col>
        <a-col :span="3">
          <a-button type="primary" icon="usergroup-add" @click="() => addingManyStudents = true">
            批量添加
          </a-button>
        </a-col>
      </a-row>
    </div>
    <a-table
      :columns="bistudentColumns"
      :row-key="record => record.index"
      :data-source="bistudents"
      :pagination="bistudentsPagination"
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
      <span slot="action" slot-scope="text, record">
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

        <a-divider type="vertical" />
        <a-config-provider :auto-insert-space-in-button="false">
          <a-button type="primary" ghost @click="showTeacherStatus(record)">
            选择老师
          </a-button>
        </a-config-provider>
      </span>
    </a-table>

    <!-- 添加单个学生的Modal -->
    <a-modal
      v-model="addingStudents"
      title="添加/修改学生"
      @ok="addingStudentConfirm()"
      @cancel="addingStudentCancel()"
      :maskClosable="false"
      :destroyOnClose="true"
      width="1150px"
    >
      <a-input placeholder="登录账号" v-model="insertBistudent.username" class="modal-input" :disabled="changingStudents"/>
      <a-input-password placeholder="登录密码" v-model="insertBistudent.password" class="modal-input"/>
      <a-input placeholder="姓名" v-model="insertBistudent.name" class="modal-input" />
      <a-input placeholder="邮箱" v-model="insertBistudent.email" class="modal-input" />
      <div class="modal-input">
        <span>
          是否推免: <a-switch v-model="insertBistudent.recommended"/>
        </span>

        <span style="margin-left: 2%">
          初试成绩: <a-input-number v-model="insertBistudent.score" :min="0" :max="1000"/>
        </span>

        <span style="margin-left: 2%">
          性别: <a-input v-model="insertBistudent.ethnic" style="width: 8%"/>
        </span>

        <span style="margin-left: 2%">
          种族: <a-input v-model="insertBistudent.gender" style="width: 8%"/>
        </span>

        <span style="margin-left: 2%">
          毕业学校: <a-input v-model="insertBistudent.graduation_university" style="width: 20%"/>
        </span>

        <span style="margin-left: 2%">
          毕业专业: <a-input v-model="insertBistudent.graduation_major" style="width: 10%"/>
        </span>
      </div>
      <a-input placeholder="家庭住址" v-model="insertBistudent.household_register" class="modal-input" />
      <a-input placeholder="联系电话" v-model="insertBistudent.phone" class="modal-input"/>
      <div class="modal-input">
        <span>
          学生类型:
          <a-select style="width: 35%" @change="changeDegree" :default-value="insertBistudent.degree">
            <a-select-option v-for="(item, key) in degrees" :key="key" :value="item.degree_id">
              {{ item.degree_description }} {{ item.enrol_description }}
            </a-select-option>
          </a-select>
        </span>

        <span style="margin-left: 10%">
          本科学校类型:
          <a-select style="width: 35%" @change="changeSource" :default-value="insertBistudent.source">
            <a-select-option v-for="(item, key) in sources" :key="key" :value="item.id">
              {{ item.description }}
            </a-select-option>
          </a-select>
        </span>
      </div>
    </a-modal>

    <!-- 查看选择老师情况的model -->
    <a-modal
      v-model="showingTeachers"
      title="选择老师情况详情"
      @ok="() => showingTeachers = false"
      :maskClosable="false"
      :destroyOnClose="true"
      width="1150px"
    >
      <a-table
        :columns="teacherColumns"
        :row-key="record => record.index"
        :data-source="showTeachers"
        :loading="loadingShowTeacher"
      >
        <span slot="action" slot-scope="text, record">
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button
              type="primary"
              ghost
              @click="select(record)"
              style="color: green; border-color: green"
              v-if="showSelectedTeachers.indexOf(record.id) === -1"
            >
              选择老师
            </a-button>
            <a-button
              type="primary"
              ghost
              @click="deselect(record)"
              style="color: red; border-color: red"
              v-else
            >
              已选择(第{{showSelectedTeachers.indexOf(record.id) + 1}}志愿)
            </a-button>
          </a-config-provider>
        </span>
      </a-table>
    </a-modal>

    <!-- 批量上传学生 -->
    <a-modal
      v-model="addingManyStudents"
      title="批量导入学生"
      @ok="addingManyStudentsDone"
      :maskClosable="false"
      :width=1250
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
              <li>学生的联系邮箱、联系电话</li>
              <li>学生是否为推免生(是：1，否：0)</li>
              <li>学生的初试成绩或复试成绩</li>
              <li>毕业学校和毕业专业</li>
              <li>居住地、民族、性别</li>
              <li>本科学校类型（请查看"Source"设置，需要描述符，例如: '原"985"高校'）</li>
              <li>学生类型（请查看"Degree"设置，需要两个描述符，中间用空格隔开, 例如: '软件工程 专硕'）</li>
            </ul>
            <p>然后，<a-button @click="downloadTemplate" type="link">点击这里</a-button>下载模版</p>
            <p>根据下载的模版，填充相关的信息，然后点击下面的按钮进入下一步</p>
          </div>
          <div v-else-if="current===1">
            <p>请点击下面的按钮选择填充好的模版文件</p>
            <p>选择文件后，请点击“解析”按钮对文件进行解析</p>
            <p>等待解析完成后（进度条显示100%），点击继续进入下一步</p>
            <div>
              <a-popover title="提示">
                <template slot="content">
                  <p>只需要将原模版文件删除，然后重新上传文件并解析即可</p>
                </template>
                <a-button type="link">
                  如何修改?
                </a-button>
              </a-popover>
              <p></p>
            </div>
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
          <div v-else-if="current===2" class="adding-students-uploading-body">
            <a-alert :message="`即将上传学生共${studentsInfo.length}人`" type="info" show-icon/>
            <a-table
              :columns="previewColumns"
              :data-source="studentsInfo"
              :row-key="record => studentsInfo.indexOf(record)"
              :scroll="{ x: 1500, y: 400 }"
            >
            </a-table>
          </div>
          <div v-else-if="current===3" class="adding-students-uploading-body">
            <a-space v-if="addingStudentsUploading">
              <a-spin/>
              <span> 正在上传 </span>
            </a-space>
            <div v-else>
              <a-alert
                message="上传完成"
                :description="`一共成功添加学生${addingStudentsAffected}人`"
                type="success"
                show-icon
              />
              <a-table
                :columns="errorColumns"
                :data-source="addingStudentsErrors"
                :row-key="record => addingStudentsErrors.indexOf(record)"
              >
              </a-table>
            </div>
          </div>
        </div>
        <div class="steps-action">
          <a-button v-if="current < steps.length - 1" type="primary" @click="addingStudentsContinue">
            继续
          </a-button>
          <a-button
            v-if="current == steps.length - 1"
            type="primary"
            @click="addingManyStudentsDone"
          >
            完成
          </a-button>
          <a-button v-if="current > 0" style="margin-left: 8px" @click="current--">
            返回上一步
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */

import * as api from '@/api/bichoiceAdmin'
import { encodeToHttp } from '@/util/ende'
import * as xlsx from 'xlsx'
import { book2blob, openDownloadDialog } from '@/util/fs'
import { queryTeacherByName } from '@/api/attendAdmin/api'

export default {
  name: 'BichoiceAdminStudents',
  computed: {
    isBichoiceAdmin () {
      return this.$store.getters.isBichoiceAdmin
    }
  },
  data () {
    const previewColumns = [
      { title: '登录账号', width: 150, dataIndex: 'username', fixed: 'left' },
      { title: '姓名', width: 100, dataIndex: 'name', fixed: 'left' },
      { title: '密码', width: 120, dataIndex: 'password' },
      { title: '联系邮箱', width: 180, dataIndex: 'email' },
      { title: '联系电话', width: 180, dataIndex: 'phone' },
      { title: '是否推免', width: 100, dataIndex: 'recommended_str' },
      { title: '成绩', width: 80, dataIndex: 'score' },
      { title: '毕业学校', width: 200, dataIndex: 'graduation_university' },
      { title: '毕业专业', width: 100, dataIndex: 'graduation_major' },
      { title: '居住地', width: 200, dataIndex: 'household_register' },
      { title: '民族', width: 80, dataIndex: 'ethnic' },
      { title: '性别', width: 50, dataIndex: 'gender' },
      { title: '本科学校类型', width: 130, dataIndex: 'source' },
      { title: '学生类型', width: 100, dataIndex: 'degree' }
    ]
    return {
      bistudents: [],
      bistudentsPagination: {
        current: 1,
        pageSize: 20,
        total: 0
      },
      loading: false,
      searchInput: null,
      bistudentColumns: [
        {
          title: '序号',
          dataIndex: 'index',
          width: '7%'
        },
        {
          title: '登录账号',
          dataIndex: 'username',
          width: '13%',
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
          title: '联系邮件',
          dataIndex: 'email',
          width: '14%'
        },
        {
          title: '学生类型',
          dataIndex: 'degree',
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
          title: '毕业学校',
          dataIndex: 'source',
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
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      insertBistudent: {
        username: '',
        password: '',
        name: '',
        recommended: false,
        score: 0,
        graduation_university: '',
        graduation_major: '',
        household_register: '',
        ethnic: '',
        phone: '',
        gender: '',
        email: '',
        source: -1,
        degree: -1
      },
      sources: [],
      degrees: [],
      addingStudents: false,
      changingStudents: false,
      changingStudentsId: 0,
      addingManyStudents: false,
      showingTeachers: false,
      showTeachers: [],
      showingTeacherStudentId: -1,
      showSelectedTeachers: [],
      loadingShowTeacher: false,
      teacherColumns: [
        {
          title: '序号',
          dataIndex: 'index',
          width: '8%'
        },
        {
          title: '老师姓名',
          dataIndex: 'name',
          width: '12%'
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          width: '15%'
        },
        {
          title: '个人主页',
          dataIndex: 'personal_page',
          width: '15%'
        },
        {
          title: '研究领域',
          dataIndex: 'research_area',
          width: '32%'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      steps: [
        // content未使用，通过v-if写在html里面了
        {
          title: '填充模版',
          content: '需要填充一个含有学生信息的模版'
        },
        {
          title: '上传模版',
          content: '将已经写好的模版上传'
        },
        {
          title: '预览',
          content: '通过解析模版，可以看到学生的大致信息'
        },
        {
          title: '上传',
          content: '学生信息上传到服务器'
        }
      ],
      current: 0,
      fileList: [],
      parsePercent: 0,
      studentsInfo: [],
      previewColumns,
      addingStudentsUploading: false,
      addingStudentsErrors: [],
      errorColumns: [
        { title: '登录账号', width: 150, dataIndex: 'username', fixed: 'left' },
        { title: '姓名', width: 100, dataIndex: 'name', fixed: 'left' },
        { title: '错误', width: 300, dataIndex: 'err', fixed: 'left' }
      ],
      addingStudentsAffected: 0
    }
  },
  mounted () {
    this.fetchBistudent()
    this.fetchSources()
    this.fetchDegrees()
  },
  methods: {
    fetchSources () {
      api.getSources()
        .then(res => {
          this.sources = res.data
        })
    },
    fetchDegrees () {
      api.getDegrees()
        .then(res => {
          this.degrees = res.data
        })
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.bistudentsPagination }
      pager.current = pagination.current
      this.bistudentsPagination = pager
      this.fetchBistudent({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      })
    },
    fetchBistudent (param = {}, confirm = undefined | Function) {
      if (Object.keys(param).length === 0) {
        param = this.bistudentsPagination
      }
      this.loading = true
      const pagination = { ...this.bistudentsPagination }
      const offset = pagination.current - 1 || 0
      const pageSize = pagination.pageSize || 20
      const query = {
        pageSize,
        offset,
        username: param.username ? param.username[0] || '' : '',
        name: param.name ? param.name[0] || '' : '',
        enrol: param.enrol ? param.enrol[0] || '' : '',
        degree: param.degree ? param.degree[0] || '' : '',
        source: param.source ? param.source[0] || '' : ''
      }
      api.getAllBistudent(query)
        .then(res => {
          const data = res.data
          const count = data.count
          const bistudents = []
          for (let i = 0; i < data.bistudents.length; i++) {
            bistudents.push({
              ...data.bistudents[i],
              username: data.bistudents[i].username,
              index: i + 1 + pageSize * offset
            })
          }

          this.bistudents = bistudents
          this.bistudentsPagination = {
            total: count,
            pageSize,
            current: offset + 1
          }
          this.loading = false
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
    changeDegree (value) {
      this.insertBistudent.degree = value
    },
    changeSource (value) {
      this.insertBistudent.source = value
    },
    addingStudentConfirm () {
      if (!this.changingStudents) {
        api.addBistudent(this.insertBistudent)
          .then(() => {
            this.$message.success('提交成功')
            this.addingStudentCancel()
            this.fetchBistudent()
          })
      } else {
        const password = this.insertBistudent.password
        api.changeBistudentInfo(this.insertBistudent.id, {
          ...this.insertBistudent,
          password: password === '' ? undefined : encodeToHttp(password)
        })
          .then(() => {
            this.$message.success('修改成功')
            this.addingStudentCancel()
            this.fetchBistudent()
          })
      }
    },
    changeInfo (record) {
      this.insertBistudent = {
        ...record,
        recommended: !!record.recommended,
        degree: this.getIdOfDegree(record.degree),
        source: this.getIdOfSource(record.source)
      }
      this.changingStudents = true
      this.addingStudents = true
    },
    getIdOfSource (source) {
      for (let i = 0; i < this.sources.length; i++) {
        if (this.sources[i].description === source) {
          return this.sources[i].id
        }
      }
      return ''
    },
    getIdOfDegree (degree) {
      for (let i = 0; i < this.degrees.length; i++) {
        if (this.degrees[i].degree_description === degree.split(' ')[0] &&
          this.degrees[i].enrol_description === degree.split(' ')[1]) {
          return this.degrees[i].degree_id
        }
      }
      return ''
    },
    deleteStudent (record) {
      const id = record.id
      api.deleteBistudent(id)
        .then(() => {
          this.fetchBistudent()
          this.$message.success('操作成功')
        })
    },
    addingStudentCancel () {
      this.insertBistudent = {
        username: '',
        password: '',
        name: '',
        recommended: false,
        score: 0,
        graduation_university: '',
        graduation_major: '',
        household_register: '',
        ethnic: '',
        phone: '',
        gender: '',
        email: '',
        source: -1,
        degree: -1
      }
      this.changingStudents = false
      this.addingStudents = false
    },
    showTeacherStatus (record) {
      const id = record.id
      this.showingTeachers = true
      this.showingTeacherStudentId = id
      this.loadingShowTeacher = true
      const pCanSelect = api.getBistudentCanSelectTeacher(id)
        .then(res => {
          const teachers = res.data
          for (let i = 0; i < teachers.length; i++) {
            teachers[i].index = i + 1
          }
          this.showTeachers = teachers
        })
      const pSelected = api.getBistudentSelectedTeacher(id)
        .then(res => {
          this.showSelectedTeachers = res.data
        })
      Promise.all([pCanSelect, pSelected])
        .then(() => {
          this.loadingShowTeacher = false
        })
    },
    select (record) {
      api.selectTeacherForStudent(this.showingTeacherStudentId, record.id)
        .then(() => {
          this.$message.success('选择成功')
          this.showTeacherStatus({ id: this.showingTeacherStudentId })
        })
    },
    deselect (record) {
      api.deleteTeacherForStudent(this.showingTeacherStudentId, record.id)
        .then(() => {
          this.$message.success('取消选择成功')
          this.showTeacherStatus({ id: this.showingTeacherStudentId })
        })
    },
    addingStudentsContinue () {
      this.current++
      if (this.current === 3) {
        this.addingStudentsUploading = true
        api.addBistudents(this.studentsInfo)
          .then(res => {
            this.addingStudentsAffected = res.data.success
            this.addingStudentsErrors = res.data.error
            this.addingStudentsUploading = false
          })
      }
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
    downloadTemplate () {
      const template = [
        ['登录账号', '密码', '姓名', '联系邮箱', '联系电话', '是否推免',
          '成绩', '毕业学校', '毕业专业', '居住地', '民族', '性别',
          '本科学校类型', '学生类型'
        ]
      ]
      const sheet = xlsx.utils.aoa_to_sheet(template)
      const workbook = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(workbook, sheet, 'sheet1')
      openDownloadDialog(book2blob(workbook), 'template.xlsx')
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
          const email = json[i]['联系邮箱']
          const phone = json[i]['联系电话']
          const recommended = json[i]['是否推免'] === 1
          const score = json[i]['成绩']
          const graduation_university = json[i]['毕业学校']
          const graduation_major = json[i]['毕业专业']
          const household_register = json[i]['居住地']
          const ethnic = json[i]['民族']
          const gender = json[i]['性别']
          const source = this.getIdOfSource(json[i]['本科学校类型'])
          const degree = this.getIdOfDegree(json[i]['学生类型'])
          parseResult.push({
            username,
            password,
            name,
            email,
            phone,
            recommended,
            recommended_str: recommended ? '是' : '否',
            score,
            graduation_university,
            graduation_major,
            household_register,
            ethnic,
            gender,
            source,
            degree
          })
        }
        this.parsePercent = 100
        this.studentsInfo = parseResult
      }
      reader.readAsArrayBuffer(file)
    },
    addingManyStudentsDone () {
      this.addingManyStudents = false
      this.fetchBistudent()
    }
  }
}
</script>

<style scoped>
.modal-input {
  margin-bottom: 10px;
}
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
  text-align: right;
  margin-top: 24px;
}
.adding-students-uploading-body {
  /* text-align: center; */
  padding-top: 30px;
  padding-bottom: 40px;
  padding-right: 30px;
}
</style>
