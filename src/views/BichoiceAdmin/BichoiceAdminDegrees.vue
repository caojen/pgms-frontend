<template>
  <div style="height: 40px">
    <a-row>
      <a-col :span="3" :offset="21">
        <a-button type="primary" icon="plus" @click="() => adding = true">
          添加Degree
        </a-button>
      </a-col>
    </a-row>

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
      selectedItems: ''
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
    }
  }
}
</script>
