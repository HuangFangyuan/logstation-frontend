<template xmlns="http://www.w3.org/1999/html">
  <div id="discover">
    <div style="margin-top: 0px; width:400px" class="search">
      <el-input placeholder="请输入内容" v-model="value" class="input-with-select">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option v-for="o in options" :label=" o.label " :value="o.value "></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div id="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="500">
        <el-table-column
          label="发生日期"
          prop="source.timestamp">
        </el-table-column>
        <el-table-column
          label="所在索引"
          prop="index">
        </el-table-column>
        <el-table-column
          label="日志级别"
          prop="source.level">
        </el-table-column>
        <el-table-column
          label="来源"
          prop="source.host">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleView(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <span class="demonstration"></span>
      <el-pagination
        layout="prev, pager, next"
        :total="pageNum">
      </el-pagination>
    </div>
    <el-dialog title="详情" width="500px" :visible.sync="dialogCardVisible">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane label="列表" name="first">
          <div class="text item">
            <el-tag type="info" class="label">发生日期</el-tag>{{ current.source.timestamp }}<br>
            <el-tag type="info" class="label">日志ID</el-tag>{{ current.id }}<br>
            <el-tag type="info" class="label">所在索引</el-tag>{{ current.index }}<br>
            <el-tag type="info" class="label">日志级别</el-tag>{{ current.source.level }}<br>
            <el-tag type="info" class="label">来源</el-tag>{{ current.source.host }}<br>
            <el-tag type="info" class="label">所在类</el-tag>{{ current.source.className }}<br>
            <el-tag type="info" class="label">日志内容</el-tag>{{ current.source.text }}<br>
          </div>
        </el-tab-pane>
        <el-tab-pane label="JSON" name="second">
          <!--{{ JSON.stringify(current) | json }}-->
          {{ current | json }}
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    created() {
      this.getLogs();
    },
    data () {
      return {
        activeName:'first',
        dialogCardVisible:false,
        pageNum:0,
        tableData:[],
        current:{
          id:0,
          index:'',
          source:{
            timestamp:'',
            level:'',
            host:'',
            className:'',
            text:''
          }
        },
        size:5,
        from:0,
        value: '',
        select: '',
        options: [
          {
            label:'发生日期',
            value:'timestamp'
          },
          {
            label:'日志ID',
            value:'id'
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
            label:'日志内容',
            value:'text'
          }
        ]
      }
    },
    props: {
      index: {
        type: String,
      }
    },
    filters: {
      dateFormatFilter: function(date) {
        if (!date){
          return '';
        }
        return this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    methods:{
      handleView(index, row){
        this.dialogCardVisible = true;
        this.current = this.tableData[index];
      },
//      dateFormat:function(row, column) {
//        var date = row[column.property];
//        if (date == undefined) {
//          return "";
//        }
//        return this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
//      },
      getLogs() {
        this.$http.get('http://localhost:8088/logs',{
          params: {
            index : this.index,
            from : 0,
            size : 10
          }
        })
          .then(rep => {
            this.tableData = rep.data.hits;
            this.pageNum = rep.data.total / 10;
            console.log(rep);
          })
      }
    }
  }
</script>

<style>
  .label {
    width: 70px;
    margin: 10px 30px 0 0;
    text-align: center;
  }
  .demo-table-expand {
    font-size: 0;
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
  #discover {
    width: 95%;
  }
  #table {
    margin:10px 0 0 20px;
    border: 1px solid #DCDFE6;
    border-radius: 3px;
    height: 500px;
  }
  .search {
    margin-left:20px;
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
