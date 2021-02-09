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
    </a-table>
  </div>
</template>

<script>
import * as api from '@/api/bichoiceAdmin'
import student from '@/router/student'

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
      ]
    }
  },
  mounted () {
    this.fetchBistudent()
  },
  methods: {
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
    }
  }
}
</script>
