<template>
  <div>
    <div>
      <el-input class="input" v-model="system1" placeholder="系统"></el-input>
      <el-input class="input" v-model="module1" placeholder="模块"></el-input>
      <div class="block">
        <el-date-picker
          v-model="startTime"
          type="date"
          placeholder="起始日期"
          value-format="timestamp">
        </el-date-picker>
      </div>
      <div class="block">
        <el-date-picker
          v-model="endTime"
          type="date"
          placeholder="截止日期"
          value-format="timestamp">
        </el-date-picker>
      </div>
      <el-button icon="el-icon-search" @click="getData" circle></el-button>
    </div>
    <div id="count" class="graph">
    </div>
    <div id="costTime" class="graph">
    </div>
    <div id="successRate" class="graph">
    </div>
  </div>
</template>

<script>
  import echarts from "echarts"
  export default {
    props: {
      index: {
        type:String,
        default:'applog'
      },
      system: String,
      module: String
    },
    mounted(){
      if (this.system !==''&& this.module !== '') {
        this.getData();
      }
    },
    data() {
      return {
        endTime: new Date().getTime(),
        startTime: new Date().getTime() - 1000*3600*24*7,
        system1:this.system,
        module1:this.module,
        count:{
          y:[],
          x:[]
        },
        costTime:{
          y:[],
          x:[]
        },
        successRate:{
          y:[],
          x:[]
        }
      };
    },
    methods:{
      getData() {
        this.getCount();
        this.getCostTime();
        this.getSuccessRate();
      },
      getCount() {
        this.$http.get("http://localhost:8088/graph/module/count",{
          params:{
            index: this.index,
            start: this.startTime,
            end: this.endTime,
            system:this.system1,
            module:this.module1
          }
        }).then( rep => {
          if (rep.data.code === 200) {
            this.count.y = rep.data.data.y;
            this.count.x = rep.data.data.x;
            this.drawCount();
          }
        })
      },
      getCostTime() {
        this.$http.get("http://localhost:8088/graph/module/cost",{
          params:{
            index: this.index,
            start: this.startTime,
            end: this.endTime,
            system:this.system1,
            module:this.module1
          }
        }).then( rep => {
          if (rep.data.code === 200) {
            this.costTime.y = rep.data.data.y;
            this.costTime.x = rep.data.data.x;
            this.drawCostTime();
          }
        })
      },
      getSuccessRate() {
        this.$http.get("http://localhost:8088/graph/module/rate",{
          params:{
            index: this.index,
            start: this.startTime,
            end: this.endTime,
            system:this.system1,
            module:this.module1
          }
        }).then( rep => {
          if (rep.data.code === 200) {
            this.successRate.y = rep.data.data.y;
            this.successRate.x = rep.data.data.x;
            this.drawSuccessRate();
          }
        })
      },
      drawCount(){
        let myChart = echarts.init(document.getElementById('count'));
        let option = {
          color:['#62d1de','#54d6b6','#a6db69','#ffd454','#ffa361','#d1d1d1'],
          title: {
            text: '任务执行次数',
            subtext: ''
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['2011年', '2012年']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
//            name:'次',
            axisLabel: {
              formatter: '{value} 次'
            },
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: this.count.y
          },
          series: [
            {
//              name: '2011年',
              type: 'bar',
              data: this.count.x
            }
          ]
        };
        myChart.setOption(option);
      },
      drawCostTime(){
        let myChart = echarts.init(document.getElementById('costTime'));
        let option = {
          color:['#62d1de','#54d6b6','#a6db69','#ffd454','#ffa361','#d1d1d1'],
          title: {
            text: '任务平均耗时',
            subtext: ''
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['2011年', '2012年']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
//            name:'ms',
            type: 'value',
            axisLabel: {
              formatter: '{value} ms'
            },
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: this.costTime.y
          },
          series: [
            {
//              name: '2011年',
              type: 'bar',
              data: this.costTime.x
            }
          ]
        };
        myChart.setOption(option);
      },
      drawSuccessRate(){
        let myChart = echarts.init(document.getElementById('successRate'));
        let option = {
          color:['#62d1de','#54d6b6','#a6db69','#ffd454','#ffa361','#d1d1d1'],
          title: {
            text: '任务执行成功率',
            subtext: ''
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['2011年', '2012年']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
//            name:'%',
            axisLabel: {
              formatter: '{value} %'
            },
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: this.successRate.y
          },
          series: [
            {
//              name: '2011年',
              type: 'bar',
              data: this.successRate.x
            }
          ]
        };
        myChart.setOption(option);
      }
    }
  };
</script>

<style scoped>
  * {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
 .block {
   display: inline-block;
 }
 .demonstration {
   color: #606266;
 }
  .graph {
    width: 500px;
    height:300px;
    margin: 80px 0 0 0;
    float: left;
  }
  .input {
    width: 150px;
  }
</style>
