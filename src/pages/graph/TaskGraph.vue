<template>
  <div>
    <div>
      <el-input class="input" v-model="system1" placeholder="系统"></el-input>
      <el-input class="input" v-model="module1" placeholder="模块"></el-input>
      <el-input class="input" v-model="task1" placeholder="任务"></el-input>
      <div class="block">
        <el-date-picker v-model="startTime" type="date" placeholder="起始日期" value-format="timestamp"></el-date-picker>
      </div>
      <div class="block">
        <el-date-picker v-model="endTime" type="date" placeholder="截止日期" value-format="timestamp">
        </el-date-picker>
      </div>
      <el-button icon="el-icon-search" @click="getData" circle></el-button>
    </div>

    <div id="counts" class="graph"></div>
    <div id="radar" class="graph2"></div>
    <div id="results" class="graph2"></div>
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
      module:String,
      task: String
    },
    mounted(){
      if (this.system !==''&& this.module !== '' && this.task !=='') {
        this.getData();
      }
    },
    data(){
      return {
        endTime: new Date().getTime(),
        startTime: new Date().getTime() - 1000*3600*24*7,
        system1: this.system,
        module1:this.module,
        task1: this.task,
        data:{
          count:0,
          costTime:0,
          successRate:0,
          min:0,
          max:0,
          dates:["1","1"],
          counts:[1,2],
          results:[],
          resultCounts:[]
        }
      }
    },
    methods:{
      getData(){
        this.$http.get("http://localhost:8088/graph/task",{
          params:{
            index: this.index,
            start: this.startTime,
            end: this.endTime,
            system:this.system1,
            module:this.module1,
            task: this.task1
          }
        }).then( rep => {
          if (rep.data.code === 200) {
            this.data.count = rep.data.data.count;
            this.data.costTime = rep.data.data.costTime;
            this.data.successRate = rep.data.data.successRate;
            this.data.min = rep.data.data.min;
            this.data.max = rep.data.data.max;
            this.data.dates = rep.data.data.dates;
            this.data.counts = rep.data.data.counts;
            this.data.results = rep.data.data.results;
            this.data.resultCounts = rep.data.data.resultCounts;
            this.draw();
            this.drawResults();
            this.drawRadar();
          }
        })
      },
      draw() {
        let myChart = echarts.init(document.getElementById('counts'));
        let option = {
          title: {
            text: this.task1 + '执行日历'
          },
          xAxis: {
            type: 'category',
            data: this.data.dates
          },
          yAxis: {
            axisLabel: {
              formatter: '{value} 次'
            },
            type: 'value'
          },
          series: [{
            data: this.data.counts,
            type: 'line'
          }]
        };
        myChart.setOption(option);
      },
      drawResults() {
        let myChart = echarts.init(document.getElementById('results'));
        let data = [];
        for (let i = 0; i < this.data.results.length; i++) {
          color:['#62d1de','#54d6b6','#a6db69','#ffd454','#ffa361','#d1d1d1'],
            data.push({
              name:this.data.results[i],
              value:this.data.resultCounts[i]
            })
        }
        let option = {
          title : {
            text: '任务执行结果',
//            subtext: '纯属虚构',
            x:'center'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: this.data.results
          },
          series : [
            {
              name: '结果',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:data,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        myChart.setOption(option);
      },
      drawRadar() {
        let myChart = echarts.init(document.getElementById('radar'));
        let value = [this.data.count,this.data.costTime,this.data.successRate];
        let option = {
          title: {
            text: ''
          },
          tooltip: {},
          legend: {
            data: ['']
          },
          radar: {
//             shape: 'circle',
            name: {
              textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            indicator: [
              { name: '执行次数', max: this.data.count*2},
              { name: '平均耗时', max: this.data.costTime*2},
              { name: '成功率', max: 100},
            ]
          },
          series: [{
            name: '',
            type: 'radar',
            // areaStyle: {normal: {}},
            data : [
              {
                value : value
              }
            ]
          }]
        };
        myChart.setOption(option);
      }
    }
  }
</script>

<style lang="scss">
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
    width: 1000px;
    height:500px;
    margin: 80px 0 0 0;
    float: left;
  }
  .graph2 {
    width: 480px;
    height:500px;
    margin: 80px 0 0 0;
    float: left;
  }
  .input {
    width: 150px;
  }
</style>
