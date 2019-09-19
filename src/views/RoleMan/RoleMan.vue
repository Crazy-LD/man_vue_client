<template>
  <div>
    <ListTemplate
      :tableData="tableData"
      :uniTableHeads="uniTableHeads"
      :multipleSelection.sync="multipleSelection"
    >
      <template #header>
        <div class="item">
          <el-button
            type="warning"
            icon="el-icon-circle-plus-outline"
            size="medium"
            round
            v-permission="7"
            @click="showAdd(true)"
          >新增角色</el-button>
        </div>

        <div class="item">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="medium"
            round
            v-permission="9"
            @click="batchChangeStatus(1)"
          >批量注销</el-button>
        </div>
        <div class="item">
          <el-button
            type="success"
            icon="el-icon-s-promotion"
            size="medium"
            round
            v-permission="10"
            @click="batchChangeStatus(0)"
          >批量恢复</el-button>
        </div>
        <div class="item">
          <SuggestInput
            placeholder="角色名称"
            :inputValue.sync="name"
            :inputValueOptions="nameOptions"
          />
        </div>
        <div class="item">
          <el-button type="primary" icon="el-icon-search" size="medium" round @click="query">查询</el-button>
        </div>
      </template>
      <template #restColumn>
        <el-table-column
          prop="statusName"
          label="角色状态"
          width="100"
          :filters="statusNameFilters"
          :filter-method="statusNameFilterFun"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.statusName === '正常' ? 'success' : scope.row.statusName === '注销' ? 'danger': 'warning'"
              disable-transitions
            >{{scope.row.statusName}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="250">
          <template slot-scope="scope">
            <el-button size="mini" v-permission="8" @click="showAdd(false, scope.row)">修改</el-button>
            <el-button
              v-show="scope.row.status === 0"
              size="mini"
              type="danger"
              v-permission="9"
              @click="changeStatus(scope.row,1)"
            >注销</el-button>
            <el-button
              v-permission="5"
              v-show="scope.row.status !== 0"
              size="mini"
              type="success"
              @click="changeStatus(scope.row,0)"
            >恢复</el-button>
          </template>
        </el-table-column>
      </template>
    </ListTemplate>
    <template v-if="openAdd === true">
      <Add :openAdd.sync="openAdd" :isAdd="isAdd" :rowData="rowData" />
    </template>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
import ListTemplate from "../../components/list_template/list_template";
import SuggestInput from "../../components/suggest-input/suggest-input";
import Add from "./Add";
const { mapState } = createNamespacedHelpers("role");
export default {
  mounted() {
    this.$store.dispatch("role/find").catch(() => {
      console.log("获取角色列表失败");
    });
  },
  data() {
    return {
      uniTableHeads: [
        {
          prop: "code",
          label: "角色编码"
        },
        {
          prop: "name",
          label: "角色名称"
        }
      ],
      multipleSelection: [],
      statusNameFilters: [
        { text: "正常", value: "正常" },
        { text: "注销", value: "注销" }
      ],
      openAdd: false, // 是否打开增加
      isAdd: true, // 是否为添加
      rowData: {},
      ids: [], // 查询时需要收集的id
      name: ""
      // nameOptions: ["张三", "李四", "王五"]
    };
  },
  computed: {
    ...mapState({
      tableData: state => state.roles
    }),
    nameOptions() {
      const plainArray = [];
      this.tableData.forEach(item => {
        plainArray.push(item.name);
      });
      return Array.from(new Set(plainArray));
    }
  },
  components: {
    ListTemplate,
    Add,
    SuggestInput
  },
  methods: {
    statusNameFilterFun(value, row) {
      return row.statusName === value;
    },
    showAdd(isAdd, rowData) {
      this.isAdd = isAdd;
      if (!isAdd) {
        this.rowData = rowData;
      }
      this.openAdd = true;
    },
    changeStatus(row, status) {
      const data = { ids: [row._id], status };
      this.$store
        .dispatch("role/batchChangeStatus", data)
        .then(response => {
          const { count } = response.data;
          this.$message({
            type: "success",
            message: `成功修改${count}个角色的信息`
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    batchChangeStatus(status) {
      const { multipleSelection } = this;
      const data = { status };
      const ids = [];
      let isCan = true;
      multipleSelection.forEach(item => {
        if (item.status === status) {
          isCan = false;
        }
        ids.push(item._id);
      });
      if (isCan) {
        data.ids = ids;
        this.$store
          .dispatch("role/batchChangeStatus", data)
          .then(response => {
            const { count } = response.data;
            this.$message({
              type: "success",
              message: `成功修改${count}个角色的信息`
            });
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        this.$message({
          type: "error",
          message: "选择的角色状态冲突"
        });
      }
    },
    query() {
      const query = {
        name: this.name.trim()
      };
      this.$store
        .dispatch("role/find", query)
        .then(() => {
          this.$message({
            type: "success",
            message: "查询角色列表成功"
          });
        })
        .catch(() => {
          console.log("查询角色列表失败");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-container {
  background: white;
  .item {
    margin: 0px 10px 20px 0px;
  }
}
</style>

