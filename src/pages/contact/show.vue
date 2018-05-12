<template>
  <div class="contact-container">
    <MyTitle title="联系人"></MyTitle>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-input class="filter-input" placeholder="输入过滤字段" prefix-icon="el-icon-search" v-model="queryString"></el-input>
        <el-button class="add-btn" type="text" @click="linkToAdd">添加</el-button>
      </div>
      <div v-for="contact in contacts" :key="contact.id" class="text item">
        <span class="label">{{ contact.name }}</span>
        <el-tag type="warning">{{ contact.method | methodFilter }}</el-tag>
        <span class="label">{{ contact.value }}</span>
        <i class="el-icon-star-on" v-if="contact.defaultUse"></i>
        <el-button class="delete-btn" size="mini" type="danger" @click="handleDelete(contact.id)">删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { getContact, deleteContact } from '../../api/contact'
  import message from '../../utils/message'
  import MyTitle from '../../components/title.vue'
  export default {
    data() {
      return {
        contacts:[],
        contactsCopy:[],
        queryString:''
      }
    },
    components: {
      MyTitle
    },
    filters: {
      methodFilter(method) {
        if (method === 'email') return "邮箱";
        else if (method === 'message') return '电话';
      }
    },
    watch: {
      queryString() {
        this.querySearchAsync(this.queryString);
      }
    },
    methods: {
      loadContact() {
        getContact()
          .then(rep => {
            this.contacts = rep.data;
            this.contactsCopy = rep.data;
          })
      },
      linkToAdd() {
        this.$router.push("/contact/add");
      },
      querySearchAsync(queryString) {
        this.contacts = queryString ? this.contactsCopy.filter(this.createStateFilter(queryString)) : this.contactsCopy;
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
            || state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
            || state.method.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
        };
      },
      handleDelete(id) {
        deleteContact(id)
          .then(rep => {
            if (rep.code === 200) {
              message.success("删除联系人成功");
            }
            else {
              message.error(rep.msg);
            }
            this.loadContact();
          })
      }
    },
    mounted(){
      this.loadContact();
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common";
  .contact-container {
    .box-card {
      width: 550px;
      margin: 50px 0 0 100px;
      max-height: 500px;
      overflow-y: auto;
      .filter-input {
        width: 200px;
      }
      .add-btn {
        float: right;
        line-height: 30px;
        padding: 3px 0;
      }
    }
    .label {
      padding-left: 15px;
      padding-right: 15px;
    }
    .delete-btn {
      float: right;
      margin-right: 10px;
    }
  }
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

</style>
