<template>
  <div class="modify-monitor">
    <MyTitle title="更新监控"></MyTitle>
    <el-form class="monitor-form" ref="form" :model="form" label-width="80px">
      <div class="action" v-if="active === 0">
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="索引">
          <el-input v-model="form.index"></el-input>
        </el-form-item>
        <el-form-item label="监控类型">
          <el-select v-model="form.type" placeholder="请选择监控类型">
            <el-option label="普通监控" value="普通监控"></el-option>
            <el-option label="次数监控" value="次数监控"></el-option>
            <el-option label="平均值监控" value="平均值监控"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="条件">
          <el-button class="condition-btn" type="text" @click="dialogFormVisible = true">+</el-button>
          <el-tag class="condition-tag" v-for="(c, index) in form.conditions" :type="conditionTagType(c.operator)" closable @close="removeCondition(index)">{{ c.searchField | fieldFilter }} {{ c.operator | operatorFilter }} {{ c.fromValue  }} {{ c.toValue }}</el-tag>
          <el-dialog class="filter" width="600px" title="条件" :visible.sync="dialogFormVisible">
            <el-form>
              <el-form-item label="字段" :label-width="formLabelWidth" class="form-item">
                <el-select v-model="searchField" placeholder="">
                  <el-option v-for="field in fields" :label="field.label" :value="field.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="操作" :label-width="formLabelWidth" class="form-item">
                <el-select v-model="operator" placeholder="">
                  <el-option v-for="o in operators" :label="o.label" :value="o.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="值" :label-width="formLabelWidth" v-if="operator !=='between'" class="form-item">
                <el-input v-model="fromValue" auto-complete="off" style="width: 217px"></el-input>
              </el-form-item>
              <div v-else>
                <el-form-item label="起始值" :label-width="formLabelWidth" class="form-item">
                  <el-input v-model="fromValue" auto-complete="off" style="width: 217px"></el-input>
                </el-form-item>
                <el-form-item label="结束值" :label-width="formLabelWidth" class="form-item">
                  <el-input v-model="toValue" auto-complete="off" style="width: 217px"></el-input>
                </el-form-item>
              </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="clear">取 消</el-button>
              <el-button type="primary" @click="query">确 定</el-button>
            </div>
          </el-dialog>
        </el-form-item>
        <div v-if="form.type === '次数监控'">
          <el-form-item label="时间范围">
            <el-input class="tip" v-model="form.interval"></el-input>
          </el-form-item>
          <el-form-item label="执行频率">
            <el-input class="tip" v-model="form.frequency"></el-input>
          </el-form-item>
        </div>
        <div v-if="form.type === '平均值监控'">
          <el-form-item label="平均字段">
            <el-input v-model="form.avgField"></el-input>
          </el-form-item>
          <el-form-item label="时间范围">
            <el-input class="tip" v-model="form.interval"></el-input>
          </el-form-item>
          <el-form-item label="执行频率">
            <el-input class="tip" v-model="form.frequency"></el-input>
          </el-form-item>
        </div>
      </div>
      <!-- step 2 -->
      <div class ="condition" v-else>
        <el-form-item label="通知方式">
          <el-select v-model="form.method" placeholder="请选择通知方式">
            <el-option label="短信" value="message"></el-option>
            <el-option label="邮箱" value="email"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" v-if="form.method === 'message'">
          <el-autocomplete v-model="form.contact" :fetch-suggestions="querySearchAsync" placeholder="请输入电话" @select="handleSelect">
            <template slot-scope="props">
              <div class="name">{{ props.item.value }}</div>
              <span class="name" style="font-size: 5px;color:gray">{{ props.item.name }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="邮箱" v-else>
          <el-autocomplete v-model="form.contact" :fetch-suggestions="querySearchAsync" placeholder="请输入邮箱" @select="handleSelect">
            <template slot-scope="props">
              <div class="name">{{ props.item.value }}</div>
              <span class="name" style="font-size: 12px;color: #b4b4b4;">{{ props.item.name }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="主题">
          <el-input v-model="form.subject"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input class="content" type="textarea" v-model="form.content"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <el-steps class="step-bar" :active="active" finish-status="success" simple>
      <el-step title="类型"></el-step>
      <el-step title="通知"></el-step>
    </el-steps>
    <div class="buttons">
      <el-button class="pre-btn" @click="pre" type="warning" plain>{{ preAction }}</el-button>
      <el-button class="next-btn" @click="next" type="success" plain>{{ nextAction }}</el-button>
    </div>
  </div>
</template>

<script>
  import MyTitle from '../../components/title.vue'
  import MyStep from '../../components/step.vue'
  import { modifyMonitor, getMonitorById } from '../../api/monitor'
  import { getContact } from '../../api/contact'
  import message from '../../utils/message'
  import { FIELD, OPERATOR, field_EN2CN, operator_EN2CN } from '../../utils/constant'
  export default {
    props: {
      id: String
    },
    components:{
      MyTitle,
      MyStep
    },
    data() {
      return {
        // 条件字段
        fromValue: '',
        toValue:'',
        searchField: '',
        operator:'',
        fields:FIELD,
        operators:OPERATOR,
        dialogFormVisible:false,
        preAction:'返回',
        nextAction:'下一步',
        active: 0,
        formLabelWidth: '120px',
        form:{
          id: 1,
          method:'message',
          index:'',
          type:'普通监控',
          contact:'',
          subject:'',
          content:'',
          interval:0,
          name:'',
          frequency:0,
          avgField:'',
          conditions:[]
        },
        contacts:[],
        timeout:null,
      }
    },
    filters:{
      dateFormatFilter(input) {
        if(input > 523364844593) {
          return format(input)
        }
        return input;
      },
      operatorFilter(operator) {
        return operator_EN2CN(operator);
      },
      fieldFilter(field) {
        return field_EN2CN(field)
      }
    },
    methods: {
      query() {
        this.form.conditions.push({
          searchField: this.searchField,
          operator : this.operator,
          fromValue: this.fromValue,
          toValue: this.toValue
        });
        this.clear();
        this._getLogsByCondition();
      },
      clear() {
        this.searchField = '';
        this.fromValue = '';
        this.toValue = '';
        this.operator = '';
        this.dialogFormVisible = false;
      },
      conditionTagType(operator) {
        if (operator === 'is')return 'success';
        if (operator ==='not')return 'danger';
      },
      removeCondition(index) {
        this.form.conditions.splice(index ,1);
      },
      pre() {
        if (this.active === 0){
          this.$router.push("/monitor/show");
        }
        else {
          this.active--;
          this.preAction = '返回';
          this.nextAction = '下一步';
        }
      },
      next() {
        if (this.active === 1){
          this.onSubmit();
        }
        else {
          this.active++;
          this.preAction = '上一步';
          this.nextAction = '完成';
        }
      },
      loadContact() {
        getContact()
          .then( rep =>   this.contact = rep.data)
          .catch( error => message.error(error));
      },
      loadMonitor() {
        getMonitorById(this.id)
          .then( rep => {
            this.form = rep.data;
            this.form.conditions = JSON.parse(rep.data.conditions);
          })
          .catch( error => message.error(error));
      },
      querySearchAsync(queryString, cb) {
        let results = this.contacts.filter(state => state.method === this.form.method);
        results = queryString ? results.filter(this.createStateFilter(queryString)) : results;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => cb(results), 200);
      },
      createStateFilter(queryString) {
        return state => state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      },
      handleSelect(item) {
        this.form.contact = item.value;
      },
      onSubmit() {
        let param = new URLSearchParams();
        param.append("name", this.form.name);
        param.append("id", this.form.id);
        param.append("index", this.form.index);
        param.append("interval", this.form.interval === null ? 0 :this.form.interval);
        param.append("method", this.form.method);
        param.append("type", this.form.type);
        param.append("conditions", JSON.stringify(this.form.conditions));
        param.append("contact", this.form.contact);
        param.append("subject", this.form.subject);
        param.append("content", this.form.content);
        param.append("avgField", this.form.avgField);
        param.append("frequency", this.form.frequency);
        modifyMonitor(param)
          .then( rep => {
            if (rep.code === 200) {
              message.success("更新成功");
              setTimeout(() => this.$router.push("/monitor/show"), 1000)
            }
          })
          .catch(error => console.log(error))
      }
    },
    mounted() {
      this.loadMonitor();
      this.loadContact();
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common";
  @mixin common() {
    margin-left: 80px;
    margin-top: 50px;
  }
  .modify-monitor {
    .monitor-form {
      width: 400px;
      .form-item {
        margin-top: 20px;
      }
      @include common;
      .tip:after {
        content: "单位: 秒";
        font-size: 5px;
        color: $font-color-4;
      }
    }
    .step-bar {
      width: 200px;
      @include common;
    }
    .buttons {
      display: flex;
      justify-content: center;
      width: 400px;
      margin-top: 15px;
      @include common;
    }
  }
</style>
