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
          生源类型:
          <a-select style="width: 35%" @change="changeSource" :default-value="insertBistudent.source">
            <a-select-option v-for="(item, key) in sources" :key="key" :value="item.id">
              {{ item.description }}
            </a-select-option>
          </a-select>
        </span>
      </div>
    </a-modal>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */

import * as api from '@/api/bichoiceAdmin'
import { encodeToHttp } from '@/util/ende'

export default {
  name: 'BichoiceAdminStudents',
  computed: {
    isBichoiceAdmin () {
      return this.$store.getters.isBichoiceAdmin
    }
  },
  data () {
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
          width: '18%'
        },
        {
          title: '专业',
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
          title: '生源',
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
      addingManyStudents: false
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
      const pager = { ...this.showingStudentsPagination }
      pager.current = pagination.current
      this.showingStudentsPagination = pager
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
      console.log(this.insertBistudent)
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
      console.log(record)
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
    }
  }
}
</script>

<style scoped>
.modal-input {
  margin-bottom: 10px;
}
</style>
