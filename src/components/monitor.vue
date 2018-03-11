<template>
  <div class="monitor">
    <p class="title">正在监控</p>
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="field"
          label="监控字段"
          width="150">
        </el-table-column>
        <el-table-column
          prop="value"
          label="监控值"
          width="120">
        </el-table-column>
        <el-table-column
          prop="open"
          label="开关"
          width="120">
        </el-table-column>
        <el-table-column
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="buttons">
      <el-button type="primary" plain>添加</el-button>
    </div>
  </div>

</template>

<script>
  export default {
    methods: {
      handleClick(row) {
        console.log(row);
      }
    },

    data() {
      return {
        tableData: [{
          field: 'level',
          value: 'error',
          open: '开'
        }]
      }
    }
  }
</script>

<style scoped>
  .monitor {
    border: 1px solid #DCDFE6;
    margin: 0 0 0 15px;
    border-radius: 3px;
    width: 1100px;
    height:630px;
  }
  .buttons {
    margin: 20px 0 0 50px;
  }
  .table {
    margin: 10px auto;
    border: 1px solid #E4E7ED;
    height: 400px;
    width: 1000px;
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
