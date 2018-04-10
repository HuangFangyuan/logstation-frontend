<template>
  <div id="health">
    <div class="upper">
      <div class="time-picker">
        <el-tag style="font-size: 15px;width:100px;height:30px;line-height:30px;text-align: center">{{ selectTime }}</el-tag>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">1小时内</el-dropdown-item>
            <el-dropdown-item command="b">1天内</el-dropdown-item>
            <el-dropdown-item command="c">1周内</el-dropdown-item>
            <el-dropdown-item command="d">1个月内</el-dropdown-item>
            <el-dropdown-item command="e">所有时间</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="graph">
        <div class="box">
          <div class="circle info">
            <span>{{ data.info }}</span>
          </div>
          <p>Info</p>
        </div>
        <div class="box">
          <div class="circle warn">
            <span>{{ data.warn }}</span>
          </div>
          <p>warn</p>
        </div>
        <div class="box">
          <div class="circle error">
            <span>{{ data.error }}</span>
          </div>
          <p>Error</p>
        </div>
      </div>
      <div class="evaluate">
        <p>当前健康评估:{{ data.score }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        selectTime:"1小时内",
        time:"1",
        unit:"hour",
        data: {
          info:0,
          warn:0,
          error:0 ,
          score:0,
        }
      }
    },
    props: {
      index: {
        type: String,
      }
    },
    methods: {
      handleCommand(command) {
        if (command === 'a') {
          this.time = 1;
          this.unit = "hour";
          this.selectTime = "1小时内"
        }
        else if (command === 'b') {
          this.time = 1;
          this.unit = "day";
          this.selectTime = "1天内"
        }
        else if (command === 'c') {
          this.time = 1;
          this.unit = "week";
          this.selectTime = "1周内"
        }
        else if (command === 'd') {
          this.time = 1;
          this.unit = "month";
          this.selectTime = "1个月内"
        }
        else if (command === 'e') {
          this.unit = "all";
          this.selectTime = "所有时间"
        }
        this.getHealthInfo();
      },
      getHealthInfo() {
        this.$http.get("http://localhost:8088/health",{
          params: {
            index: this.index,
            time: this.time,
            unit: this.unit
          }
        })
          .then(rep => {
            this.data = rep.data;
          })
          .catch(error => {

          })
      }
    },
    mounted(){
      this.getHealthInfo();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #health {

  }
  .upper {
    border: 1px solid #DCDFE6;
    margin: 0 0 0 15px;
    border-radius: 3px;
    width: 1100px;
    height:630px;
  }
  .time-picker {
    padding: 30px 0 0 100px;
  }
  .graph {
    padding: 50px 0 0 100px;
    overflow: hidden;
  }
  .box {
    float: left;
    padding-left: 50px;
  }
  .circle {
    width: 150px;
    height:150px;
    line-height: 150px;
    border: 10px solid;
    border-radius: 150px;
    text-align: center;
  }
  .info{
    border-color: #00FF7F;
    color: #00FF7F;
  }
  .debug {
    border-color: #EEB422;
    color: #EEB422;
  }
  .warn {
    border-color: #EE7942;
    color: #EE7942;
  }
  .error {
    border-color: #EE0000;
    color: #EE0000;
  }
  .box p {
    text-align: center;
    font-size: 25px;
    font-family: "Agency FB";
  }
  .box span {
    text-align: center;
    font-size: 40px;
    font-family: "Agency FB";
  }
  .evaluate {
    padding-top: 50px;
  }
  .evaluate p{
    text-align: center;
    font-size: 40px;
    font-family: "PingFang SC","Agency FB";
    color: #409EFF;
  }
</style>
