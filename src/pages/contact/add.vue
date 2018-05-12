<template>
  <div class="add-contact-container">
    <MyTitle title="添加联系"></MyTitle>
    <el-form ref="form" :model="contactForm" label-width="80px" class="form">
      <el-form-item label="联系人">
        <el-input v-model="contactForm.name"></el-input>
      </el-form-item>
      <el-form-item label="通知方式">
        <el-select v-model="contactForm.method" placeholder="请选择通知方式">
          <el-option label="短信" value="message"></el-option>
          <el-option label="邮箱" value="email"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" v-if="contactForm.method === 'email'">
        <el-input v-model="contactForm.value"></el-input>
      </el-form-item>
      <el-form-item label="电话" v-else>
        <el-input v-model="contactForm.value"></el-input>
      </el-form-item>
      <el-form-item label="默认">
        <el-switch v-model="contactForm.default"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="back">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { addContact } from '../../api/contact'
  import message from '../../utils/message'
  import MyTitle from '../../components/title.vue'
  export default {
    data() {
      return {
        contactForm: {
          name:'',
          method:'email',
          value:'',
          default:false
        }
      }
    },
    components: {
      MyTitle
    },
    methods: {
      back() {
        this.$router.go(-1);
      },
      submitForm() {
        let param = new URLSearchParams();
        param.append("name", this.contactForm.name);
        param.append("method", this.contactForm.method);
        param.append("value", this.contactForm.value);
        param.append("default", this.contactForm.default);
        addContact(param)
          .then(rep => {
            if (rep.code === 200) {
              message.success('添加联系人成功');
              this.$router.push('/contact/show');
            }
            else {
              message.error(rep.msg);
            }
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common";
  .add-contact-container {
    .form {
      width: 400px;
      margin: 80px 100px;
    }
  }
</style>
