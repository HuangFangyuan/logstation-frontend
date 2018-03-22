<template>
  <el-container>
    <el-aside width="220px">
      <el-input v-model="input_index" placeholder="输入索引">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-menu router>
        <el-menu-item index="/discover">
          <template slot="title"><i class="el-icon-view"></i>发现</template>
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-view"></i>监控</template>
            <el-menu-item index="/monitor/show">监控中</el-menu-item>
          <el-menu-item index="/monitor/event">历史事件</el-menu-item>
        </el-submenu>
        <el-menu-item index="/health">
          <template slot="title"><i class="el-icon-tickets"></i>健康</template>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-setting"></i>设置</template>
          <el-menu-item index="/contact/show">联系人</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <router-view :index="input_index" v-if="isRouterAlive"/>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        input_index: '',
        isRouterAlive: true
      }
    },
    methods: {
      reload: function() {
        this.isRouterAlive = false;
        this.$nextTick(() => (this.isRouterAlive = true))
      }
    },
    watch:{
      input_index: function() {
        this.reload();
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
  }
</style>
