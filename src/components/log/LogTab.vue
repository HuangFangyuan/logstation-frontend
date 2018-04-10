<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
    <el-tab-pane label="详情" name="first">
      <div class="text item">
        <div>
          <el-tag type="info" class="label">日期</el-tag>
          <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(0, log.source.eventTime )"></i>
          <i class="el-icon-zoom-out" title="排除" @click="filterOut(0, log.source.eventTime )"></i>
          <span class="searchable">{{ log.source.eventTime | dateFormatFilter}}</span>
        </div>
        <div>
          <el-tag type="info" class="label">日志ID</el-tag>
          <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(1, log.id )"></i>
          <i class="el-icon-zoom-out" title="排除" @click="filterOut(1,log.id)"></i>
          <span class="searchable">{{ log.id }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">所在索引</el-tag>
          <i class="el-icon-zoom-in" title="无法过滤" style="color: grey"></i>
          <i class="el-icon-zoom-out" title="无法过滤" style="color: grey"></i>
          <span class="searchable">{{ log.index }}</span>
        </div>
        <el-tag type="info" class="label">日志级别</el-tag>
        <i class="el-icon-zoom-in"  title="以此过滤" @click="filterFor(2, log.source.level )"></i>
        <i class="el-icon-zoom-out" title="排除" @click="filterOut(2, log.source.level )"></i>
        <span class="searchable">{{ log.source.level }}</span>
        <div>
          <el-tag type="info" class="label">来源</el-tag>
          <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(3, log.source.host)"></i>
          <i class="el-icon-zoom-out" title="排除" @click="filterOut(3, log.source.host)"></i>
          <span class="searchable">{{ log.source.host }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">所在类</el-tag>
          <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(4, log.source.className)"></i>
          <i class="el-icon-zoom-out" title="排除" @click="filterOut(4, log.source.className)"></i>
          <span class="searchable">{{ log.source.className }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">系统</el-tag>
          <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(5, log.source.system)"></i>
          <i class="el-icon-zoom-out" title="排除" @click="filterOut(5, log.source.system)"></i>
          <span class="searchable">{{ log.source.system }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">模块</el-tag>
          <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(6, log.source.module)"></i>
          <i class="el-icon-zoom-out" title="排除" @click="filterOut(6, log.source.module)"></i>
          <span class="searchable">{{ log.source.module }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">任务</el-tag>
          <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(7, log.source.task)"></i>
          <i class="el-icon-zoom-out" title="排除" @click="filterOut(7, log.source.task)"></i>
          <span class="searchable">{{ log.source.task }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">结果</el-tag>
          <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(8, log.source.result)"></i>
          <i class="el-icon-zoom-out" title="排除" @click="filterOut(8, log.source.result)"></i>
          <span class="searchable">{{ log.source.result }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">花时</el-tag>
          <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(9, log.source.costTime)"></i>
          <i class="el-icon-zoom-out" title="排除" @click="filterOut(9, log.source.costTime)"></i>
          <span class="searchable">{{ log.source.costTime }}ms</span>
        </div>
        <div>
          <el-tag type="info" class="label">信息</el-tag>
          <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(10, log.source.information)"></i>
          <i class="el-icon-zoom-out" title="排除" @click="filterOut(10, log.source.information)"></i>
          <span class="searchable">{{ log.source.information }}</span>
        </div>
        <div>
          <el-tag type="info" class="label">错误</el-tag>
          <i class="el-icon-zoom-in" title="以此过滤" @click="filterFor(11, log.source.error)"></i>
          <i class="el-icon-zoom-out" title="排除" @click="filterOut(11, log.source.error)"></i>
          <span class="searchable">{{ log.source.error }}</span>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="JSON" name="second">
      {{ log }}
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    filters: {
      dateFormatFilter(input) {
        let d = new Date(input);
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
        let hour = d.getHours();
        let minutes = d.getMinutes();
        let seconds = d.getSeconds() < 10 ? '0'+ d.getSeconds(): d.getSeconds();
        return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}` //ES6 模板字符串
      }
    },
    props:{
      log:{
        type: Object
      }
    },
    data(){
      return {
        activeName:'first'
      }
    },
    methods:{
      filterFor(index, value){
        this.$emit('filter', index, value, 'is');
      },
      filterOut(index, value){
        this.$emit('filter', index, value, 'not');
      },
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  }
</script>

<style>
  .el-icon-zoom-in{
    color: black;
  }
  .searchable {
    margin-left:20px;
    display: inline-block;
    width: 400px;
  }
  .label {
    width: 70px;
    margin: 10px 30px 0 0;
    text-align: center;
  }
</style>
