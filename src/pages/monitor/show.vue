<template>
  <div class="monitor">
    <MyTitle title="监控列表"></MyTitle>
    <div class="filter-container">
      <el-input class="filter-field" placeholder="输入过滤字段" prefix-icon="el-icon-search" v-model="queryString"></el-input>
      <el-button class="create-btn" size="mini" type="success" plain @click="linkToAdd">新建</el-button>
      <el-button-group class="buttons">
        <el-button size="mini" :type="active('active')" @click="showActive(true)">活动</el-button>
        <el-button size="mini" :type="active('all')" @click="showActive(false)">全部</el-button>
      </el-button-group>
    </div>
    <el-table class="monitor-table" :data="monitors" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" max-height="540">
      <el-table-column label="ID" prop="id" width="50px"></el-table-column>
      <el-table-column label="创建日期" prop="createTime" :formatter="dateFormat"></el-table-column>
      <el-table-column label="名称" prop="name" width="300"></el-table-column>
      <el-table-column label="索引" prop="index" width="100"></el-table-column>
      <el-table-column label="类型" prop="type" width="100"></el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="tagType(scope.row.active)">{{ scope.row.active | activeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleView(scope.$index, scope.row)">查看</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)"><span v-if="onlyActive">取消</span><span v-else>删除</span></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="monitor-detail" title="详情" width="500px" :visible.sync="dialogCardVisible">
      <el-button class="edit-btn" size="mini" @click="handleEdit(current.id)" type="success" plain>编辑</el-button>
      <div class="text item">
        <el-tag type="info" class="label">名称</el-tag>{{ current.name }}<br>
        <el-tag type="info" class="label">索引</el-tag>{{ current.index }}<br>
        <el-tag type="info" class="label">类型</el-tag>{{ current.type }}<br>
        <el-tag type="info" class="label">条件</el-tag>
        <el-tag class="condition-tag" v-for="(c, index) in current.conditions" :type="conditionTagType(c.operator)">
          {{ c.searchField | fieldFilter }} {{ c.operator | operatorFilter }} {{ c.fromValue  }} {{ c.toValue }}
        </el-tag><br>
        <el-tag type="info" class="label">主题</el-tag>{{ current.subject }}<br>
        <el-tag type="info" class="label">内容</el-tag>{{ current.content }}<br>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { format } from '../../utils/date'
  import { getMonitor, deleteMonitor } from '../../api/monitor'
  import MyTitle from '../../components/title.vue'
  import message from '../../utils/message'
  import { field_EN2CN, operator_EN2CN } from '../../utils/constant'
  export default {
    mounted() {
      this.loadMonitor();
    },
    components: {
      MyTitle
    },
    filters:{
      activeFilter(active){
        if (active) return '活动';
        return '非活动'
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
      active(val){
        if (this.onlyActive){
          if (val === 'active')return 'primary';
          return 'plain';
        }
        else {
          if (val === 'active')return 'plain';
          return 'primary';
        }
      },
      showActive(val) {
        if (this.onlyActive !== val){
          this.onlyActive = val;
          this.loadMonitor();
        }
      },
      tagType(active) {
        if (active) return 'success';
        return 'danger'
      },
      dateFormat(row, column) {
        let date = row[column.property];
        if (date === undefined) {
          return "";
        }
        return format(date);
      },
      querySearchAsync(queryString) {
        this.monitors = queryString ? this.monitorsCopy.filter(this.createStateFilter(queryString)) : this.monitorsCopy;
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.type.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
            || state.index.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
            || state.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
            || state.subject.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
            || state.content.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
        };
      },
      handleView(index) {
        this.dialogCardVisible = true;
        this.current = this.monitors[index];
      },
      handleEdit(id) {
        this.$router.push("/monitor/modify/" + id);
      },
      handleDelete(index, row) {
          deleteMonitor(row.id)
          .then(rep => {
            if (rep.code === 200) {
              message.success(`删除了id为${ row.id }的监控器`);
              this.loadMonitor();
            }
            else {
              message.error('删除出了一点问题')
            }
          });
      },
      linkToAdd() {
        this.$router.push("/monitor/add");
      },
      loadMonitor() {
        let params = {
          params:{
            onlyActive:this.onlyActive
          }
        };
        getMonitor(params)
          .then(rep => {
            if(rep.code === 200) {
              this.monitorsCopy = rep.data;
              this.monitorsCopy.forEach(m => {
                m.conditions = JSON.parse(m.conditions);
              });
              this.monitors = this.monitorsCopy;
              this.loading = false;
            }
          })
          .catch( error => console.log(error))
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
        loading: true,
        onlyActive:true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common";
  .monitor {
    .filter-container {
      width: 1100px;
      .filter-field {
        width: 200px;
        margin:10px 0 0 0;
      }
      .create-btn {
        margin:10px 0 0 10px;
      }
      .buttons {
        float: right;
        padding: 15px 0 0 0;
      }
    }
    .monitor-table {
      border: 1px solid $border-color-1;
      border-radius: 3px;
      width: 1100px;
      margin-top: 10px;
    }
    .monitor-detail {
      .edit-btn {
        float: right
      }
      .label {
        width: 50px;
        margin: 10px 30px 0 0;
        text-align: center;
      }
    }
  }
</style>
