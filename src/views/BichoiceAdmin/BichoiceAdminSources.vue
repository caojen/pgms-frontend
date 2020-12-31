<template>
  <div>
    <div style="height: 40px">
      <a-row>
        <a-col :span="3" :offset="21">
          <a-button type="primary" icon="plus" @click="() => adding = true">
            添加Source
          </a-button>
        </a-col>
      </a-row>
    </div>

    <a-table
      :columns="columns"
      :row-key="record => record.id"
      :data-source="sources"
      :loading="loading"
    >

      <span slot="action" slot-scope="text, record">
        <a-config-provider :auto-insert-space-in-button="false">
          <a-button type="primary" @click="changeSource(record)">
            修改描述
          </a-button>
        </a-config-provider>

        <a-divider type="vertical" />

        <a-popconfirm
          title="确定要删除这个Source吗？此操作不可恢复"
          ok-text="Yes"
          cancel-text="No"
          @confirm="deleteSource(record)"
        >
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button type="danger" ghost>
              删除Source
            </a-button>
          </a-config-provider>
        </a-popconfirm>
      </span>

    </a-table>
    <a-modal
      v-model="adding"
      title="添加Source"
      @ok="addSourceConfirm()"
      :destroyOnClose="true"
    >
      <a-input
        placeholder="新的Source描述符"
        v-model="newSource"
      />
    </a-modal>

    <a-modal
      v-model="changing"
      title="修改Source"
      @ok="changeSourceConfirm()"
    >
      <p>请输入更新后的描述符</p>
      <a-input
        placeholder="Source描述符"
        v-model="changingSource"
      />
    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api/bichoiceAdmin'

export default {
  name: 'BichoiceAdminSources',
  data () {
    return {
      loading: false,
      adding: false,
      newSource: '',
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          width: '10%'
        },
        {
          title: '描述符',
          dataIndex: 'description',
          width: '55%'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      changing: false,
      changingSourceId: -1,
      changingSource: ''
    }
  },
  computed: {
    isBichoiceAdmin () {
      return this.$store.getters.isBichoiceAdmin
    },
    sources () {
      return this.$store.state.bichoiceAdmin.sources
    }
  },
  mounted () {
    if (this.isBichoiceAdmin === false) {
      this.$router.push('/')
    } else {
      this.fetchSources()
    }
  },
  methods: {
    fetchSources () {
      this.loading = true
      this.$store.dispatch('getSources')
        .finally(() => {
          this.loading = false
        })
    },
    addSourceConfirm () {
      if (this.newSource === '') {
        this.$message.error('请输入必要字段')
      } else {
        api.addNewSource(this.newSource)
          .then(() => {
            this.$message.success('添加成功')
            this.newSource = ''
            this.adding = false
            this.fetchSources()
          })
      }
    },
    changeSource (source) {
      this.changing = true
      this.changingSourceId = source.description
      this.changingSourceId = source.id
    },
    deleteSource (source) {
      const id = source.id
      api.deleteOneSource(id)
        .then(() => {
          this.$message.success('删除成功')
          this.fetchSources()
        })
    },
    changeSourceConfirm () {
      if (this.changingSource === '') {
        this.$message.error('请提供必要信息')
      } else {
        api.changeSourceDescription(this.changingSourceId, this.changingSource)
          .then(() => {
            this.$message.success('修改成功')
            this.fetchSources()
            this.changing = false
          })
      }
    }
  }
}
</script>
