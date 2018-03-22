<template>
  <div class="contact-add">
    <p class="title">添加联系</p>
    <el-form ref="form" :model="form" label-width="80px" class="table">
      <el-form-item label="联系人">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="通知方式">
        <el-select v-model="form.method" placeholder="请选择通知方式">
          <el-option label="短信" value="message"></el-option>
          <el-option label="邮箱" value="email"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" v-if="form.method === 'email'">
        <el-input v-model="form.value"></el-input>
      </el-form-item>
      <el-form-item label="电话" v-else>
        <el-input v-model="form.value"></el-input>
      </el-form-item>
      <el-form-item label="默认">
        <el-switch v-model="form.default"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="back">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          name:'',
          method:'email',
          value:'',
          default:false
        }
      }
    },
    methods: {
      back() {
        this.$router.go(-1);
      },
      onSubmit() {
        let param = new URLSearchParams();
        param.append("name", this.form.name);
        param.append("method", this.form.method);
        param.append("value", this.form.value);
        param.append("default", this.form.default);
        this.$http.post("http://localhost:8088/contact",param)
          .then( rep => {
            if (rep.data === "success") {
              this.$router.push('/contact/show');
            }
          })
          .catch( error => {
            console.log(error)
          })
      }
    }
  }
</script>

<style scoped>
  /*.contact-add {*/
    /*border: 1px solid #DCDFE6;*/
    /*margin: 0 0 0 15px;*/
    /*border-radius: 3px;*/
    /*width: 1100px;*/
    /*height:630px;*/
  /*}*/
  .table {
    margin: 80px 350px;
  }
  .title {
    margin: 0 10px 0 10px;
    padding: 0 0 0 10px;
    color: #909399;
    border-bottom: 1px solid #E4E7ED;
    height: 38px;
    line-height: 38px;
  }
</style>
