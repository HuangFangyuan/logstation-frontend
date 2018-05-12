<template>
  <el-container class="app-container">
    <el-header id="header">
      <a class="app-name" href="/#">实时日志分析系统</a>
      <el-input class="index-input" v-model="input_index" placeholder="输入索引">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </el-header>
    <el-container>
      <el-aside class="side-nav" width="200px">
        <el-menu router>
          <el-menu-item index="/log/discover">
            <template slot="title"><i class="discover-icon"></i>发现</template>
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title"><i class="monitor-icon"></i>监控</template>
            <el-menu-item index="/monitor/show">监控列表</el-menu-item>
            <el-menu-item index="/monitor/event">历史事件</el-menu-item>
          </el-submenu>
          <el-menu-item index="/graph">
            <template slot="title"><i class="graph-icon"></i>图表</template>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title"><i class="setting-icon"></i>设置</template>
            <el-menu-item index="/contact/show">联系人</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
  import ElContainer from "../node_modules/element-ui/packages/container/src/main.vue";
  import ElHeader from "../node_modules/element-ui/packages/header/src/main.vue";

  export default {
    components: {
      ElHeader,
      ElContainer
    },
    name: 'App',
    data() {
      return {
        input_index: '',
      }
    },
    watch:{
      input_index(){
        this.$store.commit("SET_INDEX", this.input_index)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/css/common";
  $icon-h: 18px;
  $icon-w: 18px;
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  .app-container {
    padding: 0;
    width:100%;
    height:100%;
    #header {
      background-color: #19a97b;
      display: flex;
      align-items: center;
      color: white;
      overflow: hidden;
      .app-name {
        font-size: 20px;
        text-decoration: none;
        color: white;
      }
      .index-input {
        margin-left: auto;
        width: 200px;
      }
    }
    .side-nav {

    }
    .main {
      margin-left:10px;
      padding:0 0 0 20px;
      border-left: 1px solid $border-color-1;
    }
    .discover-icon {
      background-image: url("assets/svg/discover.svg");
      background-size: $icon-w $icon-h;
      width: $icon-w;
      height:$icon-h;
      display: inline-block;
      margin: 0 15px 0 4px;
    }
    .monitor-icon {
      background-image: url("assets/svg/monitor.svg");
      @extend .discover-icon
    }
    .graph-icon {
      background-image: url("assets/svg/graph.svg");
      @extend .discover-icon
    }
    .setting-icon {
      background-image: url("assets/svg/setting.svg");
      @extend .discover-icon
    }

  }
</style>
