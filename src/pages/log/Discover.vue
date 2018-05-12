<template>
  <div class="discover">
    <MyTitle title="日志信息"></MyTitle>
    <BasicInfo class="basic-info" :today="today" :total="history"></BasicInfo>
    <div class="header">
      <section class="filter-container">
        <i class="iconfont icon-guolv1"></i>
        <el-button class="filter-btn" type="text" @click="dialogFormVisible = true">过滤器</el-button>
        <el-tag class="filter-tag" v-for="(query, index) in queries" :type="queryTagType(query.operator)" closable @close="removeQuery(index)">{{ query.searchField | fieldFilter }} {{ query.operator | operatorFilter }} {{ query.fromValue | dateFormatFilter }} {{ query.toValue | dateFormatFilter }}</el-tag>
        <el-dialog class="filter" width="600px" title="过滤器" :visible.sync="dialogFormVisible">
          <el-form>
            <el-form-item label="字段" :label-width="formLabelWidth">
              <el-select v-model="searchField" placeholder="">
                <el-option v-for="field in fields" :label="field.label" :value="field.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作" :label-width="formLabelWidth">
              <el-select v-model="operator" placeholder="">
                <el-option v-for="o in operators" :label="o.label" :value="o.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="值" :label-width="formLabelWidth" v-if="operator !=='between' && searchField !== 'eventTime'">
              <el-input v-model="fromValue" auto-complete="off" style="width: 217px"></el-input>
            </el-form-item>
            <el-form-item label="日期" :label-width="formLabelWidth" v-else-if="operator !=='between' && searchField === 'eventTime'">
              <el-date-picker v-model="fromValue" type="date" placeholder="选择日期" value-format="timestamp"></el-date-picker>
            </el-form-item>
            <div v-else>
              <div v-if="searchField !== 'eventTime'">
                <el-form-item label="起始值" :label-width="formLabelWidth">
                  <el-input v-model="fromValue" auto-complete="off" style="width: 217px"></el-input>
                </el-form-item>
                <el-form-item label="结束值" :label-width="formLabelWidth">
                  <el-input v-model="toValue" auto-complete="off" style="width: 217px"></el-input>
                </el-form-item>
              </div>
              <div v-else>
                <el-form-item label="起始" :label-width="formLabelWidth">
                  <el-date-picker v-model="fromValue" type="date" placeholder="选择日期" value-format="timestamp"></el-date-picker>
                </el-form-item>
                <el-form-item label="终止" :label-width="formLabelWidth">
                  <el-date-picker v-model="toValue" type="date" placeholder="选择日期" value-format="timestamp"></el-date-picker>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="clear">取 消</el-button>
            <el-button type="primary" @click="query">确 定</el-button>
          </div>
        </el-dialog>
      </section>
      <section class="refresh-container">
        <span class="last-refresh-time">最近刷新时间: {{ refreshTime | dateFormatFilter }}</span>
        <div :class="[ iconClass ]" @click="refresh"></div>
      </section>
    </div>
    <section class="log-table">
      <el-table :data="logs" height="515">
        <el-table-column type="expand">
          <template slot-scope="props">
            <logTab :log="props.row" :fiels="fields" @filter="handleClickListItem"></logTab>
          </template>
        </el-table-column>
        <el-table-column label="日期" prop="source.eventTime" :formatter="dateFormat" sortable></el-table-column>
        <el-table-column label="所在索引" prop="index" width="120"></el-table-column>
        <el-table-column label="系统" prop="source.system" width="120"></el-table-column>
        <el-table-column label="模块" prop="source.module" width="120"></el-table-column>
        <el-table-column label="任务" prop="source.task" width="150"></el-table-column>
        <el-table-column label="日志级别" width="120">
          <template slot-scope="scope">
            <el-tag class="level-tag" :type="levelTagType(scope.row.source.level)">{{ scope.row.source.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="来源" prop="source.host"></el-table-column>
      </el-table>
    </section>
    <div class="page-container">
      <el-tag class="log-amount">一页 8 条，共 {{ total }} 条日志</el-tag>
      <el-pagination layout="prev, pager, next" background @current-change="handleCurrentChange" :total="pageNum" class="pagination"></el-pagination>
    </div>
  </div>
</template>

<script>
  import logTab from './LogTab.vue';
  import BasicInfo from './BasicInfo.vue';
  import MyTitle from '../../components/title.vue';
  import { mapState } from 'vuex';
  import { getLogs, getLogsByCondition } from '../../api/log'
  import { format } from '../../utils/date'
  export default {
    mounted() {
      this._getLogs();
    },
    components:{
      logTab,
      BasicInfo,
      MyTitle
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
            label:'日期',
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
            label:'耗时',
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
        formLabelWidth: '120px',
        today:0,
        history:0,
        iconClass: 'refresh-btn',
        refreshTime:0
      }
    },
    computed: mapState(['index']),
    watch: {
      index: {
        deep:true,
        handler(){
          this._getLogs()
        }
      }
    },
    filters: {
      dateFormatFilter(input) {
        if(input > 523364844593) {
          return format(input)
        }
        return input;
      },
      operatorFilter(operator) {
        switch (operator) {
          case 'is':
            return '是';
            break;
          case 'not':
            return '不是';
            break;
          case 'between':
            return '在之间';
            break;
        }
      },
      fieldFilter(field) {
        let fields =  [
          {
            label:'日期',
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
            label:'耗时',
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
        ];
        let chinese;
        fields.forEach( item => {
          if (item.value === field){
            chinese = item.label;
          }
        });
        return chinese;
      }
    },
    methods:{
      refresh() {
        this.iconClass = 'el-icon-loading';
        if (this.queries.length > 0) {
          this._getLogsByCondition();
        }
        else {
          this._getLogs();
        }
      },
      levelTagType(level) {
        if (level ==='INFO') return 'success';
        if (level ==='WARN') return 'warning';
        return 'danger';
      },
      queryTagType(operator) {
        if (operator === 'is')return 'success';
        if (operator ==='not')return 'danger';
      },
      removeQuery(index) {
        this.queries.splice(index ,1);
        if (this.queries.length > 0) {
          this._getLogsByCondition();
        }
        else {
          this._getLogs();
        }
      },
      query() {
        this.queries.push({
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
      handleClickListItem(index, value, operator){
        this.queries.push({
          searchField: this.fields[index].value,
          operator : operator,
          fromValue: value,
        });
        this._getLogsByCondition();
      },
      handleCurrentChange(page) {
        if(this.queries.length > 0){
          this._getLogsByCondition(this.size * (page - 1));
        }
        else {
          this._getLogs(this.size * (page - 1));
        }
      },
      dateFormat(row) {
        let date = row.source.eventTime;
        if (date === undefined) {
          return "";
        }
        return format(date);
      },
      _getLogs(from = 0) {
        let params = {
          params: {
            index: this.index,
            from: from,
            size: this.size
          }
        };
        getLogs(params)
          .then(this.handleResponse())
          .catch(this.handleError())
      },
      _getLogsByCondition(from = 0) {
        let params = {
          params : {
            index : this.index,
            queries: JSON.stringify(this.queries),
            from: from,
            size: this.size
          }
        };
        getLogsByCondition(params)
          .then(this.handleResponse())
          .catch(this.handleError())
      },
      handleResponse() {
        return rep => {
          if (rep.code === 200){
            let data = rep.data;
            this.logs = data.hits;
            this.total = data.total;
            this.pageNum = data.total / this.size * 10;
            this.today = data.today;
            this.history = data.history;
            this.refreshTime = new Date().getTime();
            this.iconClass = 'refresh-btn';
          }
          else {
            this.logs = [];
            this.today = 0;
            this.history = 0;
            this.total = 0;
            this.pageNum = 0;
          }
        }
      },
      handleError() {
        return () => this.$message.error("服务器出现错误")
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/icon/iconfont.css";
  @import "../../assets/css/common";
  .discover {
    .basic-info {
      margin-top: 20px;
    }
    .header {
      width: 1100px;
      display: flex;
      .filter-container {
        display: flex;
        align-items: center;
        margin-top: 10px;
        .filter-btn {
          color: $font-color-3;
        }
        .filter-tag {
          margin-left: 5px;
        }
      }
      .refresh-container {
        display: flex;
        margin-left: auto;
        align-items: center;
        .last-refresh-time {
          color: $font-color-3;
          font-size: 0.8rem;
          margin-right: 5px;
        }
        .refresh-btn {
          background-image: url("../../assets/svg/refresh.svg");
          background-size: 20px 20px;
          @include width-height(20px, 20px);
          display: inline-block;
        }
      }
    }
    .log-table {
      border: 1px solid $border-color-1;
      border-radius: 3px;
      width: 1100px;
      overflow-y: auto;
      .level-tag {
        width: 60px;
        text-align: center;
      }
    }
    .page-container {
      width: 1100px;
      margin-top: 30px;
      display: flex;
      .log-amount {
        display: inline-block;
      }
      .pagination {
        margin-left: auto;
      }
    }
  }
  /* element css*/
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
