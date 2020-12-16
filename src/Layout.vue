<template>
  <a-layout id="components-layout-demo-top-side-2">
    <a-layout-header id="layout-header">
      <img src="@/assets/logo.png" alt="校徽" class="logo">
      <span class="title">
        <a-space>
          <span>计算机学院</span>
          <span>研究生管理系统</span>
        </a-space>
      </span>
      <span class="user-controller" v-if=this.isLogined>
        <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            <a-icon type="user" style="fontSize: 19px"/>
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              修改密码
            </a-menu-item>
            <a-menu-item @click="logout">
              退出登录
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
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
          <a-menu v-if="value.when" :default-selected-keys=value.default mode="inline" @click="menuClick">
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
    },
    isAttendAdmin () {
      return this.$store.getters.isAttendAdmin
    }
  },
  watch: {
    // 利用watcher，将computed的返回值set到menus对象变量中
    isLogined (newVal) {
      Vue.set(this.menus.notLogined, 'when', !newVal)
    },
    isAttendAdmin (newVal) {
      Vue.set(this.menus.attendAdmin, 'when', newVal)
    }
  },
  data () {
    return {
      collapsed: false,
      menus
    }
  },
  created () {
    this.$store.dispatch('getUserStatus')
  },
  beforeMount () {
    const isLogined = this.$store.getters.isLogined
    Vue.set(this.menus.notLogined, 'when', !isLogined)
  },
  methods: {
    menuClick ({ key }) {
      if (key !== this.$route.path) {
        this.$router.push(key)
      }
    },
    logout () {
      this.$store.dispatch('userLogout')
        .finally(() => {
          this.$router.push('/redirect')
        })
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

#layout-header {
  background: white;
  border-bottom: 2px solid black;
}

.title {
  width: 80%;
  font-size: 28px;
  color: black;
  font-weight: bolder;
}
.user-controller {
  float: right;
}
</style>
