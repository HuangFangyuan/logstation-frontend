<template>
  <div class="contact">
    <p class="title">联系人</p>
    <el-card class="box-card" style="max-height: 500px;overflow-y: auto">
      <div slot="header" class="clearfix">
        <el-input
          placeholder="请输入过滤字段"
          prefix-icon="el-icon-search"
          v-model="queryString"
          style="width: 200px;">
        </el-input>
        <el-button style="float: right; padding: 3px 0" type="text" @click="linkToAdd">添加</el-button>
      </div>
      <div v-for="c in contacts" :key="c.id" class="text item">
        <span class="span">{{ c.name }}</span>
        <el-tag type="warning">{{ c.method | methodFilter }}</el-tag>
        <span class="span">{{ c.value }}</span>
        <i class="el-icon-star-on" v-if="c.defaultUse"></i>
        <el-button class="operate" size="mini" type="danger" @click="handleDelete(c.id)">删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        contacts:[
          {
            id:1,
            name :'黄方圆',
            value:'464788260@qq.com',
            method:'邮箱',
            defaultUse:true
          }
        ],
        contactsCopy:[],
        queryString:''
      }
    },
    filters: {
      methodFilter: function(method) {
        if (method === 'email') {
          return "邮箱"
        }
        else if (method === 'message') {
          return '电话'
        }
      }
    }
    ,
    watch: {
      queryString() {
        this.querySearchAsync(this.queryString);
      }
    },
    methods: {
      loadContact() {
        this.$http.get("http://localhost:8088/contact")
          .then( rep => {
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
        this.$http.delete("http://localhost:8088/contact/" + id)
          .then( rep => {
            if (rep.data === "success") {

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

<style scoped>
  .operate {
    float: right;
    margin-right: 10px;
  }
  .contact {
    /*padding: 20px 0 0 20px;*/
  }
  span {
    padding-left: 15px;
    padding-right: 15px;
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

  .box-card {
    width: 550px;
    margin: 50px 0 0 250px;
  }
  .title {
    margin: 0 10px 0 10px;
    padding: 0 0 0 10px;
    color: #909399;
    border-bottom: 1px solid #E4E7ED;
    height: 38px;
    line-height: 38px;
    width: 1100px;
  }
</style>
