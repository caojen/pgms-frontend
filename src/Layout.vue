<template>
  <a-layout id="components-layout-demo-top-side-2">
    <a-layout-header class="header" theme="light">
      <div class="logo" />
    </a-layout-header>
    <a-layout>
      <a-layout-sider
        width="200"
        style="background: #fff"
        v-model="collapsed"
        collapsible
        theme="light"
      >
        <span v-for="(value, key, indexOuter) in menus" :key="indexOuter">
          <a-menu v-if="value.when" :default-selected-keys=value.default mode="inline" @click="menuClick" @openChange="menuOpenChange">
            <a-menu-item v-for="settings in value.items" :key="settings.key">
              <a-icon :type=settings.icon />
              <span> {{ settings.description }} </span>
            </a-menu-item>
          </a-menu>
        </span>
      </a-layout-sider>
      <a-layout>
        <a-layout-content
          :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '500px' }"
        >
          <router-view
            :style="{height: '100%'}"
          />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
import Vue from 'vue'
import menus from '@/util/menus'

export default {
  computed: {
    isLogined () {
      return this.$store.getters.isLogined
    }
  },
  watch: {
    // 利用watcher，将computed的返回值set到menus对象变量中
    isLogined (newVal) {
      Vue.set(this.menus.notLogined, 'when', !newVal)
    }
  },
  data () {
    return {
      collapsed: true,
      menus
    }
  },
  created () {
    this.$store.dispatch('getUserStatus')
  },
  mounted () {
    const isLogined = this.$store.getters.isLogined
    Vue.set(this.menus.notLogined, 'when', !isLogined)
  },
  methods: {
    menuClick ({ key }) {
      if (key !== this.$route.path) {
        this.$router.push(key)
      }
    }
  }
}
</script>

<style>
#components-layout-demo-top-side-2 .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 28px 16px 0;
  float: left;
}
</style>
