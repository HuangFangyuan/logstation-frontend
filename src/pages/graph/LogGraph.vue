<template>
  <div>
    <MyTitle title="日志分析"></MyTitle>
    <el-card class="box-card">
      <div slot="header" class="header">
        <span>日志热力图</span>
      </div>
      <div>
        <div id="event"></div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="header">
        <span>来源Top</span>
        <el-dropdown class="" @command="changeSize">
          <span class="el-dropdown-link">{{ size }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command= 1 >1</el-dropdown-item>
            <el-dropdown-item command= 5 >5</el-dropdown-item>
            <el-dropdown-item command= 10 >10</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown class="drop-down" @command="changeTime">
          <span class="el-dropdown-link">{{ time }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="今日">今日</el-dropdown-item>
            <el-dropdown-item command="全部">全部</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div>
        <div id="top-n"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import echarts from "echarts"
  import MyTitle from '../../components/title.vue'
  import { mapState } from 'vuex'
  export default {
    mounted(){
      this.getData();
    },
    computed:mapState(['index']),
    components:{
      MyTitle
    },
    data() {
      return {
        time:'今日',
        size:5,
        endTime: new Date().getTime(),
        startTime: new Date().getTime() - 1000*3600*24*7,
        data:[],
        topNY:[],
        topNData:[]
      };
    },
    methods:{
      changeTime(command) {
        this.time = command;
        this.getData();
      },
      changeSize(command) {
        this.size = command;
        this.getData();
      },
      getData() {
        this.$http.get("http://localhost:8088/logs/graph",{
          params:{
            index: this.index
          }
        })
          .then( rep => {
            this.data = rep.data.data;
            this.draw(this.data);
          });

        this.$http.get("http://localhost:8088/logs/graph/topN",{
          params:{
            index:this.index,
            size:this.size,
            time:this.time
          }
        })
          .then( rep => {
            let data = rep.data.data;
            this.topNY = [];
            this.topNData = [];
            data.forEach( item => {
              this.topNData.push(item.count);
              this.topNY.push(item.name);
            });
            this.drawTopN();
          })
      },
      draw(){
        let DATA = this.data;
        function getVirtulData(year) {
          year = year || '2018';
          let date = +echarts.number.parseDate(year + '-01-01');
          let end = +echarts.number.parseDate((+year + 1) + '-01-01');
          let dayTime = 3600 * 24 * 1000;
          let data = [];
          for (let time = date; time < end; time += dayTime) {
            data.push([
              echarts.format.formatTime('yyyy-MM-dd', time),
              0
            ]);
          }
          DATA.forEach( item => {
            data[(+echarts.number.parseDate(item.day) - +echarts.number.parseDate(year + '-01-01')) / (3600 * 24 * 1000)][1] = item.count;
          });
          return data;
        }
        let myChart = echarts.init(document.getElementById('event'));
        let option = {
          tooltip: {
            position: 'top'
          },
          visualMap: {
            min: 0,
            max: 100,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            top: 'top'
          },

          calendar: [
            {
              range: '2018',
              cellSize: ['auto', 20]
            }
            ],

          series: [{
            type: 'heatmap',
            coordinateSystem: 'calendar',
            calendarIndex: 0,
            data: getVirtulData(2018)
          }]

        };

        myChart.setOption(option);
      },
      drawTopN() {
        let myChart = echarts.init(document.getElementById('top-n'));
        let option = {
          title: {
            text: '',
            subtext: ''
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['2011年']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: this.topNY
          },
          series: [
            {
//              name: '2011年',
              type: 'bar',
              data: this.topNData,
            }
          ]
        };
        myChart.setOption(option);
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common";
  @mixin common() {
    width: 1000px;
  }
  .header {
    display: flex;
    align-items: center;
    .drop-down {
      margin-left: auto;
    }
  }
  #event {
    height: 250px;
    @include common()
  }
  #top-n {
    height: 500px;
  }

  /*  element css */
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .box-card {
    margin-top: 20px;
    width: 1100px;
  }
</style>
