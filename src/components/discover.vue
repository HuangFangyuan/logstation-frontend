<template>
  <div id="discover">
    <div id="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="550">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="时间">
                <span>{{ props.row.source.timestamp }}</span>
              </el-form-item>
              <el-form-item label="级别">
                <span>{{ props.row.source.level }}</span>
              </el-form-item>
              <el-form-item label="ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="来源">
                <span>{{ props.row.source.host }}</span>
              </el-form-item>
              <el-form-item label="所在类">
                <span>{{ props.row.source.className }}</span>
              </el-form-item>
              <el-form-item label="内容">
                <span>{{ props.row.source.text }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="时间"
          prop="source.timestamp">
        </el-table-column>
        <el-table-column
          label="索引"
          prop="index">
        </el-table-column>
        <el-table-column
          label="级别"
          prop="source.level">
        </el-table-column>
        <el-table-column
          label="来源"
          prop="source.host">
        </el-table-column>
        <el-table-column
          label="内容"
          prop="source.text">
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
  </div>
</template>

<script>
  export default {
    created() {
      this.getLogs();
    },
    data () {
      return {
        pageNum:0,
        tableData:[],
        size:10,
        from:0
      }
    },
    props: {
      index: {
        type: String,
      }
    },
    methods:{
      handleClick(row) {
        console.log(row);
      },
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
            this.pageNum = rep.data.total / 10
            console.log(rep);
          })
          .catch(error => {
            console.log(error);
          })
      }
    }
  }
</script>

<style>
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
    margin-left: 40px;
    border: 1px solid #F2F2F2;
    height: 550px;
  }
  .block {
    margin: 30px 0 0 30px;
  }
</style>
