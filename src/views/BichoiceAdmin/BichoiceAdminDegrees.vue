<template>
  <div style="height: 40px">
    <a-row>
      <a-col :span="3" :offset="21">
        <a-button type="primary" icon="plus" @click="() => adding = true">
          添加Degree
        </a-button>
      </a-col>
    </a-row>

    <a-table
      :columns="columns"
      :row-key="record => record.degree_id"
      :data-source = "degrees"
      :loading="loading"
    >
      <span slot="action" slot-scope="text, record">
        <a-config-provider :auto-insert-space-in-button="false">
          <a-button type="primary" @click="changeDegree(record)">
            修改描述
          </a-button>
        </a-config-provider>

        <a-divider type="vertical" />

        <a-popconfirm
          title="确定要删除这个Degree吗？此操作不可恢复"
          ok-text="Yes"
          cancel-text="No"
          @confirm="deleteDegree(record)"
        >
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button type="danger" ghost>
              删除Degree
            </a-button>
          </a-config-provider>
        </a-popconfirm>
      </span>
    </a-table>

    <a-modal
      v-model="adding"
      title="添加Degree"
      @ok="addDegreeComfirm()"
    >
      <a-input
        placeholder="新的Degree描述符"
        v-model="newDegree"
      />
      <p></p>
      <p>请选择指定一个Enrol</p>
      <p></p>

      <a-select
        mode="default"
        :value="selectedItems"
        style="width: 100%"
        @select="handleChange"
      >
        <a-select-option
          v-for="(item, key) in filterOptions"
          :key=key
          :value="`${item.id} - ${item.description}`"
        >
          {{item.id}} - {{ item.description }}
        </a-select-option>
      </a-select>

    </a-modal>

    <a-modal
      v-model="changing"
      title="修改Degree"
      @ok="changeDegreeComfirm()"
    >
      <a-input
        v-model="changingDegree.degree_description"
        placeholder="新的Degree描述符"
      />
    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api/bichoiceAdmin'

export default {
  name: 'BichoiceAdminDegrees',
  data () {
    return {
      loading: false,
      adding: false,
      newDegree: '',
      newEnrolId: -1,
      selectedItems: '',
      columns: [
        {
          title: '序号',
          dataIndex: 'degree_id',
          width: '12%'
        },
        {
          title: 'Degree描述符',
          dataIndex: 'degree_description',
          width: '25%'
        },
        {
          title: 'Enrol描述符',
          dataIndex: 'enrol_description',
          width: '25%'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      changingDegree: {},
      changing: false
    }
  },
  computed: {
    degrees () {
      return this.$store.state.bichoiceAdmin.degrees
    },
    enrols () {
      return this.$store.state.bichoiceAdmin.enrols
    },
    filterOptions () {
      return this.enrols.filter(o => this.selectedItems !== o)
    }
  },
  watch: {
    selectedItems (newVal) {
      if (newVal !== '') {
        const id = parseInt(newVal.split('-')[0].trim())
        this.newEnrolId = id
      }
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.loading = true
      const promiseDegree = this.$store.dispatch('getDegrees')
      const promiseEnrol = this.$store.dispatch('getEnrols')
      Promise.all([
        promiseDegree,
        promiseEnrol
      ])
        .then(() => {
          this.loading = false
        })
    },
    handleChange (selectedItems) {
      this.selectedItems = selectedItems
    },
    addDegreeComfirm () {
      if (this.selectedItems !== '' && this.newDegree !== '' && this.newEnrolId !== -1) {
        api.addNewDegree(this.newDegree, this.newEnrolId)
          .then(() => {
            this.$message.success('添加成功')
            this.adding = false
            this.fetch()
          })
      } else {
        this.$message.error('请提供必要信息')
      }
    },
    deleteDegree (degree) {
      const id = degree.degree_id
      api.deleteDegree(id)
        .then(() => {
          this.$message.success('删除成功')
          this.fetch()
        })
    },
    changeDegree (degree) {
      this.changingDegree = {
        ...degree
      }
      this.changing = true
    },
    changeDegreeComfirm () {
      if (this.changingDegree.degree_description === '') {
        this.$message.error('请提供必要信息')
      } else {
        api.changeDegreeDescription(this.changingDegree.degree_id, this.changingDegree.degree_description)
          .then(() => {
            this.fetch()
            this.changing = false
            this.$message.success('修改成功')
          })
      }
    }
  }
}
</script>
