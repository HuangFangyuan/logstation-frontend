<template>
  <div class="step-container" ref="active">
    <el-steps class="step-bar" v-bind:style="style" :active="active" finish-status="success" simple>
      <el-step title="类型"></el-step>
      <el-step title="通知"></el-step>
    </el-steps>
    <div class="buttons" v-bind:style="style">
      <el-button class="pre-btn" @click="pre" type="warning" plain>{{ preAction }}</el-button>
      <el-button class="next-btn" @click="next" type="success" plain>{{ nextAction }}</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props:{
      returnUrl:String,
      width:{
        type:String,
        default:'400px'
      }
    },
    data(){
      return {
        active:0,
        preAction:'返回',
        nextAction:'下一步',
        style:{
          width:this.width
        }
      }
    },
    methods:{
      pre() {
        if (this.active === 0){
          this.$router.push(this.returnUrl);
        }
        else {
          this.active--;
          this.preAction = '返回';
          this.nextAction = '下一步';
        }
      },
      next() {
        if (this.active === 1){
          this.$emit("submitForm")
        }
        else {
          this.active++;
          this.preAction = '上一步';
          this.nextAction = '完成';
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .step-container {
    .step-bar {

    }
    .buttons {
      display: flex;
      justify-content: center;
      margin-top: 15px;
    }
  }
</style>
