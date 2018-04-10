<template>
  <div class="add-monitor">
    <p class="title">更新</p>
    <el-form ref="form" :model="form" label-width="80px" class="form">
      <div class="action" v-if="active === 0">
        <el-form-item label="索引">
          <el-input v-model="form.index"></el-input>
        </el-form-item>
        <el-form-item label="监控类型">
          <el-select v-model="form.type" placeholder="请选择监控类型">
            <el-option label="定值监控" value="定值监控"></el-option>
            <el-option label="次数监控" value="次数监控"></el-option>
            <el-option label="比例监控" value="比例监控"></el-option>
            <el-option label="平均值监控" value="平均值监控"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="form.type === '定值监控'">
          <el-form-item label="字段">
            <el-input v-model="form.field"></el-input>
          </el-form-item>
          <el-form-item label="值">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </div>
        <div v-else-if="form.type === '次数监控'">
          <el-form-item label="字段">
            <el-input v-model="form.field"></el-input>
          </el-form-item>
          <el-form-item label="值">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
          <el-form-item label="间隔">
            <el-input v-model="form.interval"></el-input>
          </el-form-item>
        </div>
        <div v-else-if="form.type === '比例监控'">
          <el-form-item label="字段">
            <el-input v-model="form.field"></el-input>
          </el-form-item>
          <el-form-item label="值">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
          <el-form-item label="间隔">
            <el-input v-model="form.interval"></el-input>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="字段">
            <el-input v-model="form.field"></el-input>
          </el-form-item>
          <el-form-item label="值">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
          <el-form-item label="间隔">
            <el-input v-model="form.interval"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class ="condition" v-else>
        <el-form-item label="通知方式">
          <el-select v-model="form.method" placeholder="请选择通知方式">
            <el-option label="短信" value="message"></el-option>
            <el-option label="邮箱" value="email"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" v-if="form.method === 'message'">
          <el-autocomplete
            v-model="form.contact"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入电话"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="邮箱" v-else>
          <el-autocomplete
            v-model="form.contact"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入邮箱"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="主题">
          <el-input v-model="form.subject"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="form.content"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <el-steps :active="active" finish-status="success" align-center >
      <el-step title="类型"></el-step>
      <el-step title="通知"></el-step>
    </el-steps>
    <div class="buttons">
      <el-button style="margin-top: 12px;" @click="pre" type="warning" plain>{{ preAction }}</el-button>
      <el-button style="margin-top: 12px;" @click="next" type="success" plain>{{ nextAction }}</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
        id: String
    },
    data() {
      return {
        preAction:'返回',
        nextAction:'下一步',
        active: 0,
        form:{
          id: 1,
          method:'message',
          index:'',
          type:'定值监控',
          field:'',
          value:'',
          contact:'',
          subject:'',
          content:'',
          interval:0
        },
        contacts:[],
        timeout:null,
      }
    },
    methods: {
      fail() {
        this.$notify.error({
          title: '失败',
          message: '更新出了一点问题'
        });
      },
      success() {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success'
        });
      },
      pre() {
        if (this.active === 0){
          this.$router.push("/monitor/show");
        }
        if (this.active > 0){
          this.active--;
          this.preAction = '返回';
          this.nextAction = '下一步';
        }
      },
      next() {
        if (this.active === 1){
          this.onSubmit();
        }
        if (this.active < 1) {
          this.active++;
          this.preAction = '上一步';
          this.nextAction = '完成';
        }
      },
      loadContact() {
        this.$http.get("http://localhost:8088/contact")
          .then( rep => {
            this.contact = rep.data;
          })
          .catch( error => {
            console.log(error);
          });
      },
      loadMonitor() {
        this.$http.get("http://localhost:8088/monitor/" + this.id)
          .then( rep => {
            this.form = rep.data;
          })
          .catch( error => {
            console.log(error);
          });
      },
      querySearchAsync(queryString, cb) {
        let contacts = this.contacts.filter(this.filterMethod());
        let results = queryString ? contacts.filter(this.createStateFilter(queryString)) : contacts;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 200);
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      filterMethod() {
        var that = this;
        return (state) => {
          return state.method === that.form.method;
        };
      },
      handleSelect(item) {
        this.form.contact = item.value;
      },
      onSubmit() {
        let param = new URLSearchParams();
        param.append("id", this.form.id);
        param.append("index", this.form.index);
        param.append("interval", this.form.interval === null ? 0 :this.form.interval);
        param.append("method", this.form.method);
        param.append("type", this.form.type);
        param.append("field", this.form.field);
        param.append("value", this.form.value);
        param.append("contact", this.form.contact);
        param.append("subject", this.form.subject);
        param.append("content", this.form.content);
        this.$http.put("http://localhost:8088/monitor",param)
          .then( rep => {
            if (rep.data === "success") {
              this.success();
              setTimeout(()=>{
                this.$router.push("/monitor/show");
              },1000)
            }
          })
          .catch( error => {
            console.log(error)
          });
      }
    },
    mounted() {
      this.loadMonitor();
      this.loadContact();
    }
  }
</script>

<style scoped>
  .add-monitor {
    border: 1px solid #DCDFE6;
    margin-left: 20px;
    border-radius: 3px;
    padding-bottom: 20px;
  }
  .buttons {
    text-align: center;
  }
  .form {
    margin: 80px 350px;
    height: 500px;
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
