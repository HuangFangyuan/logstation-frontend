<template>
  <el-tabs class="log-tab" v-model="activeName" @tab-click="handleClick" type="card">
    <el-tab-pane label="详情" name="first">
      <div class="text item">
        <div>
          <el-tag type="info" class="label">日期</el-tag>
          <div class="operate-container">
            <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(0, log.source.eventTime )"></i>
            <i class="el-icon-zoom-out" title="排除" @click="filterOut(0, log.source.eventTime )"></i>
          </div>
          <span class="searchable">{{ log.source.eventTime | dateFormatFilter }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">日志ID</el-tag>
          <div class="operate-container">
            <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(1, log.id )"></i>
            <i class="el-icon-zoom-out" title="排除" @click="filterOut(1,log.id)"></i>
          </div>
          <span class="searchable">{{ log.id }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">所在索引</el-tag>
          <div class="operate-container">
            <i class="el-icon-zoom-in" title="无法过滤" style="color: grey"></i>
            <i class="el-icon-zoom-out" title="无法过滤" style="color: grey"></i>
          </div>
          <span class="searchable">{{ log.index }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">日志级别</el-tag>
          <div class="operate-container">
            <i class="el-icon-zoom-in"  title="以此过滤" @click="filterFor(2, log.source.level )"></i>
            <i class="el-icon-zoom-out" title="排除" @click="filterOut(2, log.source.level )"></i>
          </div>
          <span class="searchable">{{ log.source.level }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">来源</el-tag>
          <div class="operate-container">
            <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(3, log.source.host)"></i>
            <i class="el-icon-zoom-out" title="排除" @click="filterOut(3, log.source.host)"></i>
          </div>
          <span class="searchable">{{ log.source.host }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">所在类</el-tag>
          <div class="operate-container">
            <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(4, log.source.className)"></i>
            <i class="el-icon-zoom-out" title="排除" @click="filterOut(4, log.source.className)"></i>
          </div>
          <span class="searchable">{{ log.source.className }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">系统</el-tag>
          <div class="operate-container">
            <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(5, log.source.system)"></i>
            <i class="el-icon-zoom-out" title="排除" @click="filterOut(5, log.source.system)"></i>
          </div>
          <span class="searchable">{{ log.source.system }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">模块</el-tag>
          <div class="operate-container">
            <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(6, log.source.module)"></i>
            <i class="el-icon-zoom-out" title="排除" @click="filterOut(6, log.source.module)"></i>
            <i class="el-icon-document" title="报表" @click="moduleGraph(log.source.system, log.source.module)"></i>
          </div>
          <span class="searchable">{{ log.source.module }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">任务</el-tag>
          <div class="operate-container">
            <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(7, log.source.task)"></i>
            <i class="el-icon-zoom-out" title="排除" @click="filterOut(7, log.source.task)"></i>
            <i class="el-icon-document" title="报表" @click="taskGraph(log.source.system, log.source.module, log.source.task)"></i>
          </div>
          <span class="searchable">{{ log.source.task }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">结果</el-tag>
          <div class="operate-container">
            <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(8, log.source.result)"></i>
            <i class="el-icon-zoom-out" title="排除" @click="filterOut(8, log.source.result)"></i>
          </div>
          <span class="searchable">{{ log.source.result }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">耗时</el-tag>
          <div class="operate-container">
            <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(9, log.source.costTime)"></i>
            <i class="el-icon-zoom-out" title="排除" @click="filterOut(9, log.source.costTime)"></i>
          </div>
          <span class="searchable">{{ log.source.costTime }}ms</span>
        </div>
        <div>
          <el-tag type="info" class="label">信息</el-tag>
          <div class="operate-container">
            <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(10, log.source.information)"></i>
            <i class="el-icon-zoom-out" title="排除" @click="filterOut(10, log.source.information)"></i>
          </div>
          <span class="searchable">{{ log.source.information }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">错误</el-tag>
          <div class="operate-container">
            <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(11, log.source.error)"></i>
            <i class="el-icon-zoom-out" title="排除" @click="filterOut(11, log.source.error)"></i>
          </div>
          <span class="searchable">{{ log.source.error }}</span>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="JSON" name="second">
      <pre>
        {{ log }}
      </pre>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import { format } from '../../utils/date'
  export default {
    filters: {
      dateFormatFilter(date) {
        return format(date);
      }
    },
    props:{
      log: Object,
      fields: Array
    },
    data(){
      return {
        activeName:'first'
      }
    },
    methods:{
      taskGraph(system, module, task){
        this.$router.push({
          name: 'task',
          params:{
            system: system,
            module: module,
            task: task
          }
        })
      },
      moduleGraph(system, module){
        this.$router.push({
          name: 'module',
          params:{
            system: system,
            module: module
          }
        })
      },
      filterFor(index, value){
        this.$emit('filter', index, value, 'is');
      },
      filterOut(index, value){
        this.$emit('filter', index, value, 'not');
      },
      handleClick(tab, event) {
      }
    }
  }
</script>

<style lang="scss" scoped>
  .log-tab {
    .label {
      width: 70px;
      margin: 10px 20px 0 0;
      text-align: center;
    }
    .operate-container {
      display: inline-flex;
      width: 30px;
    }
    .searchable {
      margin-left:20px;
      display: inline-block;
      width: 400px;
    }
    .el-icon-zoom-in{
      color: black;
    }
  }
</style>
