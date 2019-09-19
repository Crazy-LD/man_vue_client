<template>
  <div>
    <ListTemplate
      :tableData="tableData"
      :uniTableHeads="uniTableHeads"
      :multipleSelection.sync="multipleSelection"
      :hiddenCheck="true"
    >
      <template #header>
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
            <el-button size="mini" @click="showEdit(scope.row)">配置权限</el-button>
          </template>
        </el-table-column>
      </template>
    </ListTemplate>
    <template v-if="openEdit === true">
      <Edit :openEdit.sync="openEdit" :permissions="permissions" @setPermissions="setPermissions" />
    </template>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
import ListTemplate from "../../components/list_template/list_template";
import SuggestInput from "../../components/suggest-input/suggest-input";
import Edit from "./Edit";
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
      openEdit: false,
      permissions: [], // 传给Edit组件的权限数组,number
      targetId: "",
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
    Edit,
    SuggestInput
  },
  methods: {
    statusNameFilterFun(value, row) {
      return row.statusName === value;
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
    },
    showEdit(rowData) {
      this.permissions = rowData.permissions;
      this.targetId = rowData._id;
      console.log(this.permissions);
      this.openEdit = true;
    },
    setPermissions(permissions) {
      console.log(this.permissions, "thisPermisson");
      console.log(this.targetId);
      console.log(permissions, "permisions");
      this.$store
        .dispatch("role/changePermissions", {
          _id: this.targetId,
          permissions: Array.from(new Set(permissions))
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "修改角色权限成功"
          });
          this.openEdit = false;
        })
        .catch(e => {
          console.log(e);
          this.$message({
            type: "error",
            message: "修改角色权限失败，请检查网络"
          });
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