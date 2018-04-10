<template>
  <div>
    <p class="title">基本信息</p>
    <el-row>
      <el-col :span="6">
        <div class="grid-content" style="border-left:5px solid #E6A23C;">
          <p class="time">今日</p>
          <p class="amount">{{ today }}</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content" style="border-left:5px solid #F56C6C;">
          <p class="time">历史</p>
          <p class="amount">{{ total }}</p>
      </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data(){
      return {

      }
    },
    props:{
      total:{
        type:Number,
        default:0
      },
      today:{
        type:Number,
        default:0
      }
    }
  }

</script>

<style scoped>
  * {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  .title {
    width: 100%;
    color: #303133;
  }
  .time {
    margin-left:10px;
    font-size:20px;
    height: 15px;
  }
  .amount {
    margin-left:10px;
    font-size: 25px;
    height: 15px;
  }

</style>
