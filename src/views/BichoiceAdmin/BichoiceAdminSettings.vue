<template>
  <div>
    <div style="height: 40px">
      <a-row>
        <a-col :span="3" :offset="21">
          <a-button type="primary" icon="plus" @click="() => showing = true">
            添加Setting
          </a-button>
        </a-col>
      </a-row>
    </div>
    <a-table
      :columns="columns"
      :data-source="settings"
      :loading="fetching"
      bordered
    >
      <span slot="operation" slot-scope="text, record">
        <a-button type="primary" @click="update(record)">
          修改
        </a-button>
      </span>
    </a-table>

    <a-modal
      v-model="showing"
      title="添加或修改Setting"
      @ok="insertOrUpdateConfirm()"
    >
      <p>请输入目标设置的键值对</p>
      <div style="border: 10px;">
        <a-input
          placeholder="Key"
          v-model="newKey"
          :disabled="keyDisabled"
        />
      </div>
      <p></p>
      <div style="border: 20px;">
        <a-input
          placeholder="Value"
          v-model="newVal"
        />
      </div>
    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api/bichoiceAdmin'

export default {
  name: 'BichoiceAdminSettings',
  data () {
    return {
      settings: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          width: '10%'
        },
        {
          title: 'Key',
          dataIndex: 'key',
          width: '35%'
        },
        {
          title: 'Value',
          dataIndex: 'value'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      fetching: false,
      showing: false,
      keyDisabled: false,
      newKey: '',
      newVal: ''
    }
  },
  mounted () {
    this.fetchSettings()
  },
  methods: {
    fetchSettings () {
      this.fetching = true
      api.getSettings()
        .then(res => {
          this.settings = res.data.map(m => {
            return {
              ...m,
              index: res.data.indexOf(m) + 1,
              value: JSON.parse(m.value).value
            }
          })
        })
        .finally(() => {
          this.fetching = false
        })
    },
    update (setting) {
      this.keyDisabled = true
      this.newKey = setting.key
      this.newVal = setting.value
      this.showing = true
    },
    insertOrUpdateConfirm () {
      const key = this.newKey
      let value = this.newVal
      if (/^(-?|\+?)[0-9]+$/.test(value)) {
        value = parseInt(value)
      }
      api.insertOrUpdateSetting(key, value)
        .then(() => {
          this.$message.success('操作成功')
          this.fetchSettings()
          this.newKey = ''
          this.newVal = ''
          this.showing = false
          this.keyDisabled = false
        })
    }
  }
}
</script>
