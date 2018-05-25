<template>
  <div class="event-container">
    <MyTitle title="历史事件"></MyTitle>
    <el-table
      class="event-table"
      :data="events"
      style="width: 1100px"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading">
      <el-table-column label="触发日期" prop="createTime" :formatter="dateFormat"  ></el-table-column>
      <el-table-column label="监控ID" prop="monitor.id" width="70"></el-table-column>
      <el-table-column label="监控名称" prop="monitor.name" width="300"></el-table-column>
      <el-table-column label="类型" prop="monitor.type"></el-table-column>
      <el-table-column label="发送状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.send">已发送</el-tag>
          <el-tag type="danger" v-else>未发送</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleView(scope.$index, scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="event-detail" title="详情" width="500px" :visible.sync="dialogCardVisible">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane label="事件" name="first">
          <el-tag type="info" class="label">发生时间</el-tag>{{ current.createTime | timeFilter }}<br>
          <el-tag type="info" class="label">发送状态</el-tag>{{ current.send | sendFilter}}<br>
        </el-tab-pane>
        <el-tab-pane label="监控" name="second">
          <div class="text item">
            <el-tag type="info" class="label">名称</el-tag>{{ current.monitor.name }}<br>
            <el-tag type="info" class="label">索引</el-tag>{{ current.monitor.index }}<br>
            <el-tag type="info" class="label">类型</el-tag>{{ current.monitor.type }}<br>
            <el-tag type="info" class="label">条件</el-tag>
            <el-tag class="condition-tag" v-for="(c, index) in current.monitor.conditions" :type="conditionTagType(c.operator)">
              {{ c.searchField | fieldFilter }} {{ c.operator | operatorFilter }} {{ c.fromValue  }} {{ c.toValue }}
            </el-tag><br>
            <el-tag type="info" class="label">主题</el-tag>{{ current.monitor.subject }}<br>
            <el-tag type="info" class="label">内容</el-tag>{{ current.monitor.content }}<br>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <div class="page-container">
      <el-tag class="log-amount">共 {{ total }} 条数据</el-tag>
      <el-pagination class="pagination" layout="prev, pager, next" background @current-change="handleCurrentChange" :total="pageNum"></el-pagination>
    </div>
  </div>
</template>

<script>
  import MyTitle from '../../components/title.vue'
  import { format } from '../../utils/date'
  import { FIELD, OPERATOR, field_EN2CN, operator_EN2CN } from '../../utils/constant'
  export default {
    mounted() {
      this.loadEvent();
    },
    components: {
      MyTitle
    },
    filters: {
      sendFilter(send) {
        if (send)
          return '已发送';
        else
          return '未发送'
      },
      timeFilter(date) {
        return format(date)
      },
      operatorFilter(operator) {
        return operator_EN2CN(operator);
      },
      fieldFilter(field) {
        return field_EN2CN(field)
      }
    },
    methods: {
      conditionTagType(operator) {
        if (operator === 'is')return 'success';
        if (operator ==='not')return 'danger';
      },
      handleClick(tab, event) {
      },
      dateFormat:function(row, column) {
        let date = row[column.property];
        if (date === undefined) {
          return "";
        }
        return format(date);
      },
      handleCurrentChange(page) {
        this.loadEvent(page-1);
      },
      handleView(index, row) {
        this.current = this.events[index];
        this.dialogCardVisible = true;
      },
      loadEvent(from = 0) {
        this.$http.get("http://localhost:8088/event",{
          params: {
            from: from,
            size: this.size
          }
        })
          .then( rep => {
            this.events = rep.data.data.events;
            this.events.forEach(e => {
              e.monitor.conditions = JSON.parse( e.monitor.conditions);
            });
            this.total = rep.data.data.total;
            this.pageNum = rep.data.data.total / this.size * 10;
            this.loading = false;
          })
      },
    },
    data() {
      return {
        activeName:'first',
        dialogCardVisible:false,
        events:[],
        total:0,
        pageNum:0,
        from:0,
        size:8,
        current:{
          monitor: {
            name:'',
            index:'',
            type:'',
            conditions:[],
            subject:'',
            content:''
          }
        },
        loading: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common";
  .event-container {
    .event-table {
      border: 1px solid $border-color-1;
      border-radius: 3px;
      height: 500px;
    }
    .event-detail {
      .label {
        width: 70px;
        text-align: center;
        margin-top: 5px;
        margin-right: 10px;
      }
    }
    .page-container {
      width: 1100px;
      margin-top: 30px;
      display: flex;
       .log-amount {
         display: inline-block
       }
      .pagination {
        margin-left: auto;
      }
     }
  }
</style>
