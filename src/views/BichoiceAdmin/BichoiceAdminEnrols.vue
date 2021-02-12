<template>
  <div>
    <a-alert
      message="一致性警告:为了保持逻辑一致，请不要添加重复的描述符"
      show-icon
      type="warning"
      style="margin-bottom: 30px"
    />

    <div style="height: 40px">
      <a-row>
        <a-col :span="3" :offset="21">
          <a-button type="primary" icon="plus" @click="() => adding = true">
            添加Enrol
          </a-button>
        </a-col>
      </a-row>
    </div>

    <a-table
      :columns="columns"
      :row-key="record => record.id"
      :data-source="enrols"
      :loading="loading"
    >

      <span slot="action" slot-scope="text, record">
        <a-config-provider :auto-insert-space-in-button="false">
          <a-button type="primary" @click="changeEnrol(record)">
            修改描述
          </a-button>
        </a-config-provider>

        <a-divider type="vertical" />

        <a-popconfirm
          title="确定要删除这个Enrol吗？此操作不可恢复"
          ok-text="Yes"
          cancel-text="No"
          @confirm="deleteEnrol(record)"
        >
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button type="danger" ghost>
              删除Enrol
            </a-button>
          </a-config-provider>
        </a-popconfirm>
      </span>

    </a-table>
    <a-modal
      v-model="adding"
      title="添加Enrol"
      @ok="addEnrolConfirm()"
      :destroyOnClose="true"
    >
      <a-input
        placeholder="新的Enrol描述符"
        v-model="newEnrol"
      />
    </a-modal>

    <a-modal
      v-model="changing"
      title="修改Enrol"
      @ok="changeEnrolConfirm()"
    >
      <p>请输入更新后的描述符</p>
      <a-input
        placeholder="Enrol描述符"
        v-model="changingEnrol"
      />
    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api/bichoiceAdmin'

export default {
  name: 'BichoiceAdminEnrols',
  data () {
    return {
      loading: false,
      adding: false,
      newEnrol: '',
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          width: '10%'
        },
        {
          title: '描述符',
          dataIndex: 'description',
          width: '70%'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      changing: false,
      changingEnrolId: -1,
      changingEnrol: ''
    }
  },
  computed: {
    isBichoiceAdmin () {
      return this.$store.getters.isBichoiceAdmin
    },
    enrols () {
      return this.$store.state.bichoiceAdmin.enrols
    }
  },
  mounted () {
    if (this.isBichoiceAdmin === false) {
      this.$router.push('/')
    } else {
      this.fetchEnrols()
    }
  },
  methods: {
    fetchEnrols () {
      this.loading = true
      this.$store.dispatch('getEnrols')
        .finally(() => {
          this.loading = false
        })
    },
    addEnrolConfirm () {
      if (this.newEnrol === '') {
        this.$message.error('请输入必要字段')
      } else {
        api.addNewEnrol(this.newEnrol)
          .then(() => {
            this.$message.success('添加成功')
            this.newEnrol = ''
            this.adding = false
            this.fetchEnrols()
          })
      }
    },
    changeEnrol (enrol) {
      this.changing = true
      this.changingEnrol = enrol.description
      this.changingEnrolId = enrol.id
    },
    deleteEnrol (enrol) {
      const id = enrol.id
      api.deleteOneEnrol(id)
        .then(() => {
          this.$message.success('删除成功')
          this.fetchEnrols()
        })
    },
    changeEnrolConfirm () {
      if (this.changingEnrol === '') {
        this.$message.error('请提供必要信息')
      } else {
        api.changeEnrolDescription(this.changingEnrolId, this.changingEnrol)
          .then(() => {
            this.$message.success('修改成功')
            this.fetchEnrols()
            this.changing = false
          })
      }
    }
  }
}
</script>
