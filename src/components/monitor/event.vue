<template>
  <div class="event">
    <p class="title">历史事件</p>
    <el-table
      :data="events"
      style="width: 100%"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading">
      <el-table-column
        label="日期"
        prop="createTime"
        :formatter="dateFormat"  >
      </el-table-column>
      <el-table-column
        label="监控名称"
        prop="monitor.name">
      </el-table-column>
      <el-table-column
        label="类型"
        prop="monitor.type">
      </el-table-column>
      <el-table-column
        label="字段"
        prop="monitor.field">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.send">已发送</el-tag>
          <el-tag type="danger" v-else>未发送</el-tag>
        </template>
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

</template>

<script>
  export default {
    created() {
      this.loadEvent();
    },
    filters: {
      sendFilter(send) {
        if (send)
          return '已发送';
        else
          return '未发送'
      }
    },
    methods: {
      dateFormat:function(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
      },
      handleView(index, row) {
        this.$router.push("/event/view/" + row.id);
      },
      loadEvent() {
        this.$http.get("http://localhost:8088/event")
          .then( rep => {
            this.events = rep.data;
            this.loading = false;
          })
      },
    },
    data() {
      return {
        events:[],
        loading: true
      }
    }
  }
</script>

<style scoped>
  .event {
    border: 1px solid #DCDFE6;
    margin: 0 0 0 20px;
    border-radius: 3px;
    width: 1100px;
    height:630px;
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
