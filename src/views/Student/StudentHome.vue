<template>
  <div>
    <a-card :loading="loading" title="我的信息" style="max-width: 50%;">
      <p>
        欢迎，{{ name }}
      </p>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'StudentHome'
}
</script>
