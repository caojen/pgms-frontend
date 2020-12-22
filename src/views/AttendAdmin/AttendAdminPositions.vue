<template>
  <div>
    <div style="height: 40px">
      <a-row>
        <a-col :span="3" :offset="21">
          <a-button type="primary" icon="plus" @click="handleShowAddPositions()">
            添加位置
          </a-button>
        </a-col>
      </a-row>
    </div>

    <a-table
      :columns="positionsColumns"
      :row-key="record => record.index"
      :data-source="positions"
      :loading="fetchingPositions"
    >
      <span slot="action" slot-scope="text, record">
        <a-config-provider :auto-insert-space-in-button="false">
          <a-button type="primary" ghost @click="changePosition(record)">
            修改信息
          </a-button>
        </a-config-provider>
        <a-divider type="vertical" />
        <a-popconfirm
          ok-text="确认删除"
          cancel-text="取消"
          @confirm="deletePosition(record.id)"
          style="max-width: 30%"
        >
          <template slot="title">
            <div>确定要删除这个位置吗？</div>
            <div>警告：删除操作不可撤销</div>
          </template>
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button type="danger" ghost>
              删除位置
            </a-button>
          </a-config-provider>
        </a-popconfirm>
      </span>
    </a-table>

    <!-- 添加位置的modal -->
    <a-modal
      v-model="showingAddPositions"
      title="添加位置"
      @ok="addingPositionConfirm"
      @cancel="addingPositionCancel"
      :width=500
    >
      <a-input v-model="addingPositionDescription" placeholder="位置描述" class="adding-input-box"/>
      <a-input v-model="addingPositionDevice" placeholder="设备号" class="adding-input-box"/>
    </a-modal>

    <!-- 修改位置信息的modal -->
    <a-modal
      v-model="showingChangePosition"
      title="修改位置信息"
      @ok="changePositionConfirm"
      @cancel="changePositionCancel"
      :width=500
    >
      <a-input v-model="changingPosition.index" placeholder="设备序号" class="adding-input-box" disabled/>
      <a-input v-model="changingPosition.description" placeholder="位置描述" class="adding-input-box"/>
      <a-input v-model="changingPosition.device" placeholder="设备号" class="adding-input-box"/>
    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api/attendAdmin'
export default {
  name: 'AttendAdminPosition',
  data () {
    return {
      showingAddPositions: false,
      positionsTablePagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      positions: [],
      fetchingPositions: true,
      positionsColumns: [
        {
          title: '序号',
          dataIndex: 'index',
          width: '10%'
        },
        {
          title: '描述',
          dataIndex: 'description',
          width: '20%'
        },
        {
          title: '设备号',
          dataIndex: 'device',
          width: '30'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      addingPositionDescription: '',
      addingPositionDevice: '',
      changingPosition: {},
      showingChangePosition: false
    }
  },
  mounted () {
    this.fetchPositions()
  },
  methods: {
    handleShowAddPositions () {
      this.showingAddPositions = true
    },
    fetchPositions (confirm = undefined | Function) {
      this.fetchingPositions = true
      api.getAllPositions()
        .then(res => {
          const positions = res.data
          for (const i in positions) {
            positions[i].index = parseInt(i) + 1
          }
          this.positions = positions
          this.fetchingPositions = false
          if (confirm) {
            confirm()
          }
        })
    },
    deletePosition (id) {
      api.deleteOnePosition(id)
        .then(() => {
          this.$message.success('删除讲座成功')
          this.fetchPositions()
        })
    },
    addingPositionConfirm () {
      const description = this.addingPositionDescription
      const device = this.addingPositionDevice
      api.addOnePosition({
        description,
        device
      })
        .then(() => {
          this.$message.success('添加讲座成功')
          this.addingPositionDescription = ''
          this.addingPositionDevice = ''
          this.showingAddPositions = false
          this.fetchPositions()
        })
    },
    addingPositionCancel () {
      this.addingPositionDescription = ''
      this.addingPositionDevice = ''
      this.showingAddPositions = false
    },
    changePosition (record) {
      this.showingChangePosition = true
      this.changingPosition = record
    },
    changePositionConfirm () {
      api.changeOnePosition(this.changingPosition.id, {
        description: this.changingPosition.description,
        device: this.changingPosition.device
      })
        .then(() => {
          this.$message.success('修改成功')
          this.showingChangePosition = false
          this.changingPosition = {}
          this.fetchPositions()
        })
    },
    changePositionCancel () {
      this.showingChangePosition = false
      this.changingPosition = {}
    }
  }
}
</script>

<style scoped>
.adding-input-box {
  margin: 5px;
}
</style>
