<template>
  <div class="discover">
    <BasicInfo></BasicInfo>
    <i class="iconfont icon-guolv1"></i>
    <el-button type="text" @click="dialogFormVisible = true" style="color: #909399">过滤器</el-button>
    <el-tag :type="queryTagType(operator)" v-if="operator" closable @close="clearQuery">{{ searchField }} {{ operator | operatorFilter }} {{ fromValue }} {{ toValue }}</el-tag>
    <el-dialog title="过滤器" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="字段" :label-width="formLabelWidth">
          <el-select v-model="searchField" placeholder="">
            <el-option v-for="f in fields" :label="f.label" :value="f.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作" :label-width="formLabelWidth">
          <el-select v-model="operator" placeholder="">
            <el-option v-for="o in operators" :label="o.label" :value="o.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="值" :label-width="formLabelWidth" v-if="operator !=='between'">
          <el-input v-model="fromValue" auto-complete="off"></el-input>
        </el-form-item>
        <div v-else>
          <div v-if="searchField !== 'eventTime'">
            <el-form-item label="起始值" :label-width="formLabelWidth">
              <el-input v-model="fromValue" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="结束值" :label-width="formLabelWidth">
              <el-input v-model="toValue" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div v-else="" style="margin-left: 50px">
            <div class="block">
              <span class="demonstration">起始</span>
              <el-date-picker
                v-model="fromValue"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <div class="block">
              <span class="demonstration">终止</span>
              <el-date-picker
                v-model="toValue"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearQuery">取 消</el-button>
        <el-button type="primary" @click="query">确 定</el-button>
      </div>
    </el-dialog>

    <div class="table">
      <el-table
        :data="logs"
        style="width: 1100px"
        max-height="520">
        <el-table-column type="expand">
          <template slot-scope="props">
            <logTab :log="props.row" @filter="handleClickListItem"></logTab>
          </template>
        </el-table-column>
        <el-table-column
          label="日期"
          prop="source.eventTime"
          :formatter="dateFormat"
          sortable>
        </el-table-column>
        <el-table-column
          label="所在索引"
          prop="index">
        </el-table-column>
        <el-table-column
          label="日志级别">
          <template slot-scope="scope">
            <el-tag :type="levelTagType(scope.row.source.level)">{{ scope.row.source.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="来源"
          prop="source.host">
        </el-table-column>
      </el-table>
    </div>
    <el-tag>共 {{ total }} 条数据</el-tag>
    <div class="block" style="display: inline-block">
      <span class="demonstration"></span>
      <el-pagination
        layout="prev, pager, next"
        background
        @current-change="handleCurrentChange"
        :total="pageNum">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import logTab from './LogTab.vue';
  import BasicInfo from './BasicInfo.vue';
  export default {
    created() {
      this.getLogs();
    },
    components:{
      logTab,
      BasicInfo,
    },
    data () {
      return {
        dialogFormVisible:false,
        pageNum:0,
        logs:[],
        size:8,
        total:0,
        fromValue: '',
        toValue:'',
        searchField: '',
        operator:'',
        queries:[],
        operators:[
          {
          label:'等于',
          value:'is'
          },{
          label:'不等于',
          value:'not'
          },{
          label:'之间',
          value:'between'
          }],
        fields: [
          {
            label:'发生日期',
            value:'eventTime'
          },
          {
            label:'日志ID',
            value:'_id'
          },
          {
            label:'日志级别',
            value:'level'
          },
          {
            label:'来源',
            value:'host'
          },
          {
            label:'所在类',
            value:'class'
          },
          {
            label:'系统',
            value:'system'
          },
          {
            label:'模块',
            value:'module'
          },
          {
            label:'任务',
            value:'task'
          },
          {
            label:'结果',
            value:'result'
          },
          {
            label:'花时',
            value:'costTime'
          },
          {
            label:'信息',
            value:'information'
          },
          {
            label:'错误',
            value:'error'
          }
        ],
        formLabelWidth: '120px'
      }
    },
    props: {
      index: {
        type: String,
        default:'applog'
      }
    },
    filters: {
      dateFormatFilter(input) {
        let d = new Date(input);
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
        let hour = d.getHours();
        let minutes = d.getMinutes();
        let seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
        return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}` //ES6 模板字符串
      },
      operatorFilter(operator) {
        if (operator === 'is') return 'is';
        if (operator === 'not') return 'is not';
        if (operator === 'between') return 'is between';
      }
    },
    methods:{
      levelTagType(level) {
        if (level ==='INFO') return 'success';
        if (level ==='WARN') return 'warning';
        return 'danger';
      },
      queryTagType(operator) {
        if (operator === 'is')return 'success';
        if (operator ==='not')return 'danger';
      },
      clearQuery() {
        this.searchValue = '';
        this.fromValue = '';
        this.toValue = '';
        this.operator = '';
        this.dialogFormVisible = false;
        this.getLogs();
      },
      query() {
        this.dialogFormVisible = false;
        this.getLogsByCondition();
      },
      handleClickListItem(index, value, operator){
        this.searchField = this.fields[index].value;
        this.fromValue = value;
        this.operator = operator;
        this.getLogsByCondition();
      },
      handleCurrentChange(page) {
        if(this.searchField !== ''){
          this.getLogsByCondition(this.size * (page - 1));
        }
        else {
          this.getLogs(this.size * (page - 1));
        }
      },
      dateFormat(row) {
        let date = row.source.eventTime;
        if (date === undefined) {
          return "";
        }
        return this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
      },
      getLogs(from = 0) {
        this.$http.get('http://localhost:8088/logs',{
          params: {
            index : this.index,
            from : from,
            size : this.size
          }
        })
          .then(this.handleResponse())
          .catch(this.handleError())
      },
      getLogsByCondition(from = 0) {
        this.$http.get('http://localhost:8088/logs/condition',{
          params: {
            index : this.index,
            field: this.searchField,
            fromValue: this.fromValue,
            toValue: this.toValue,
            operator: this.operator,
            from: from,
            size: this.size
          }
        })
          .then(this.handleResponse())
          .catch(this.handleError())
      },
      handleResponse() {
        return rep => {
          console.log(rep);
          let result = rep.data;
          if (result.code === 200){
            this.logs = result.data.hits;
            this.total = result.data.total;
            this.pageNum = result.data.total / this.size * 10;
          }
        }
      },
      handleError() {
        return () => {
          this.$notify({
            title: '错误',
            message: "服务器出现错误"
          })
        }
      },
    }
  }
</script>

<style>
  @import "../../assets/icon/iconfont.css";
  .icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .discover {
    width: 1100px;
    margin-left: 20px;
  }
  .table {
    margin:10px 0 0 0;
    border: 1px solid #DCDFE6;
    border-radius: 3px;
    height: 500px;
  }
  .block {
    margin: 30px 0 0 30px;
  }
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
