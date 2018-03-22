<template>
  <div class="monitor">
    <p class="title">正在监控</p>
    <el-input
      placeholder="请输入过滤字段"
      prefix-icon="el-icon-search"
      v-model="queryString"
      style="width: 200px; margin:10px 0 0 10px">
    </el-input>
    <el-button size="mini" type="success" plain @click="linkToAdd" style="margin:10px 0 0 10px">新建</el-button>
    <el-table
      :data="monitors"
      style="width: 100%"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading">
      <el-table-column
        label="创建日期"
        prop="createTime"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        label="名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="索引"
        prop="index">
      </el-table-column>
      <el-table-column
        label="类型"
        prop="type">
      </el-table-column>
      <el-table-column
        label="字段"
        prop="field">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleView(scope.$index, scope.row)">查看</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="详情" width="500px" :visible.sync="dialogCardVisible">
      <el-button
      size="mini"
      @click="handleEdit(current.id)"
      type="success" plain
      style="float: right">编辑</el-button>
      <div class="text item">
        <el-tag type="info" class="label">名称</el-tag>{{ current.name }}<br>
        <el-tag type="info" class="label">索引</el-tag>{{ current.index }}<br>
        <el-tag type="info" class="label">类型</el-tag>{{ current.type }}<br>
        <el-tag type="info" class="label">字段</el-tag>{{ current.field }}<br>
        <el-tag type="info" class="label">值</el-tag>{{ current.value }}<br>
        <el-tag type="info" class="label">主题</el-tag>{{ current.subject }}<br>
        <el-tag type="info" class="label">内容</el-tag>{{ current.content }}<br>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    created() {
      this.loadMonitor();
    },
    methods: {
      dateFormat:function(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
      },
      querySearchAsync(queryString) {
        this.monitors = queryString ? this.monitorsCopy.filter(this.createStateFilter(queryString)) : this.monitorsCopy;
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
            || state.type.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
            || state.field.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
            || state.index.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
            || state.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
            || state.subject.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
            || state.content.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
        };
      },
      handleView(index, row) {
        this.dialogCardVisible = true;
        this.current = this.monitors[index];
      },
      handleEdit(id) {
        this.$router.push("/monitor/modify/" + id);
      },
      handleDelete(index, row) {
        this.$http.delete("http://localhost:8088/monitor/" + row.id )
          .then( rep => {
            if (rep.data === 'success') {
              this.$notify({
                title: '成功',
                message: '删除了id为'+ row.id,
                type: 'success'
              });
              this.loadMonitor();
            }
            else {
              this.$notify.error({
                title: '失败',
                message: '删除出了一点问题'
              })
            }
          });
      },
      linkToAdd() {
        this.$router.push("/monitor/add");
      },
      loadMonitor() {
        this.$http.get("http://localhost:8088/monitor")
          .then( rep => {
            this.monitors = rep.data;
            this.monitorsCopy = rep.data;
            this.loading = false;
          })
          .catch( error => {
            console.log(error)
          })
      },
    },
    watch: {
      queryString() {
        this.querySearchAsync(this.queryString);
      }
    },
    data() {
      return {
        queryString:'',
        dialogCardVisible:false,
        monitors:[],
        monitorsCopy:[],
        current:{
          id:0,
          value:'',
          type:'',
          field:'',
          index:'',
          name:'',
          subject:'',
          content:''
        },
        loading: true
      }
    }
  }
</script>

<style scoped>
  .label {
    width: 50px;
    margin: 10px 30px 0 0;
    text-align: center;
  }
  .monitor {
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
