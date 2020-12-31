<template>
  <div>
    students
  </div>
</template>

<script>
import * as api from '@/api/bichoiceAdmin'

export default {
  name: 'BichoiceAdminStudents',
  computed: {
    isBichoiceAdmin () {
      return this.$store.getters.isBichoiceAdmin
    }
  },
  data () {
    return {
      bistudents: []
    }
  },
  mounted () {
    this.fetchBistudent()
  },
  methods: {
    fetchBistudent () {
      console.log('fetching')
    }
  }
}
</script>
