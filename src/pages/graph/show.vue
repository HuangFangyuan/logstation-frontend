<template>
  <div>
    <MyTitle title="图表"></MyTitle>
    <el-tabs v-model="activeName" type="card">
      <!--<el-tab-pane label="日志分析" name="log">-->
      <!--<health :index="index"></health>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="系统分析" name="system">-->
      <!--<health :index="index"></health>-->
      <!--</el-tab-pane>-->
      <el-tab-pane label="模块分析" name="module">
        <ModuleGraph :index="index" :system="system" :module="module"></ModuleGraph>
      </el-tab-pane >
      <el-tab-pane label="任务分析" name="task">
        <TaskGraph :index="index" :system="system" :module="module" :task="task"></TaskGraph>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import ModuleGraph from './ModuleGraph.vue';
  import TaskGraph from './TaskGraph.vue';
  import Health from '../health/health.vue';
  import MyTitle from '../../components/title.vue'
  export default {
    props:{
      index:{
        type:String,
        default:"applog"
      },
    },
    components:{
      ModuleGraph,
      TaskGraph,
      Health,
      MyTitle
    },
    data() {
      return {
        activeName: this.$route.params.activeName,
        system: this.$route.params.system,
        module: this.$route.params.module,
        task: this.$route.params.task
      }
    }
  }
</script>

<style>

</style>
