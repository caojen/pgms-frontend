<template>
  <div>
    students
  </div>
</template>

<script>
export default {
  name: 'BichoiceAdminStudents',
  computed: {
    isBichoiceAdmin () {
      return this.$store.getters.isBichoiceAdmin
    }
  }
}
</script>
