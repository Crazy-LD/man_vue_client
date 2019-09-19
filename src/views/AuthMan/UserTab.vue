<template>
  <div>
    <ListTemplate
      :tableData="tableData"
      :uniTableHeads="uniTableHeads"
      :multipleSelection.sync="multipleSelection"
    >
      <template #header>
        <div class="item">
          <SuggestInput
            placeholder="用户名称"
            :inputValue.sync="name"
            :inputValueOptions="nameOptions"
          />
        </div>
        <div class="item">
          <el-cascader
            :options="pIdOptions"
            :props="{ checkStrictly: true,expandTrigger: 'hover', emitPath: false }"
            clearable
            v-model="pId"
            :show-all-levels="false"
            placeholder="部门"
          ></el-cascader>
        </div>
        <div class="item">
          <el-checkbox v-model="hasChildren" label="子查询" border></el-checkbox>
        </div>
        <div class="item">
          <RangeDatePicker startPlace="成立时间" endPlace="结束时间" :start2End.sync="start2End" />
        </div>
        <div class="item">
          <el-button type="primary" icon="el-icon-search" size="medium" round @click="query">查询</el-button>
        </div>
      </template>

      <template #restColumn>
        <el-table-column
          prop="positionId.name"
          label="职位"
          width="100"
          :filters="positionNameFilters"
          :filter-method="positionNameFilterFun"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag disable-transitions>{{scope.row.positionId&&scope.row.positionId.name}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="roleIds"
          label="角色"
          width="100"
          :filters="roleNameFilters"
          :filter-method="roleNameFilterFun"
          filter-placement="bottom-end"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-for="role in scope.row.roleIds" :key="role.name">{{role.name}}、</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="statusName"
          label="员工状态"
          width="100"
          :filters="statusNameFilters"
          :filter-method="statusNameFilterFun"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.statusName === '正常' ? 'success' : scope.row.statusName === '注销' ? 'danger': 'primary'"
              disable-transitions
            >{{scope.row.statusName}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="entryTime" label="入职时间" sortable width="150" :formatter="formatter"></el-table-column>

        <el-table-column label="操作" min-width="250">
          <template slot-scope="scope">
            <el-button size="mini" @click="showEdit( scope.row)">配置权限</el-button>
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
import RangeDatePicker from "../../components/range-date-picker/range-date-picker";
import ListTemplate from "../../components/list_template/list_template";
import SuggestInput from "../../components/suggest-input/suggest-input";
import Edit from "./Edit";

import { formatTime } from "../../utils";
const { mapState } = createNamespacedHelpers("user");
const { mapState: departMapState } = createNamespacedHelpers("department");
export default {
  mounted() {
    this.$store.dispatch("user/find").catch(() => {
      console.log("获取用户列表失败");
    });
    if (this.pIdOptions.length === 0) {
      this.$store.dispatch("department/getDepartOps").catch(() => {
        console.log("获取用户选项失败");
      });
    }
  },
  data() {
    return {
      uniTableHeads: [
        {
          prop: "username",
          label: "用户账号"
        },
        {
          prop: "name",
          label: "用户姓名"
        },
        {
          prop: "sex",
          label: "性别"
        },
        {
          prop: "departmentId.name",
          label: "部门"
        }
      ],
      multipleSelection: [],

      statusNameFilters: [
        { text: "正常", value: "正常" },
        { text: "注销", value: "注销" },
        { text: "冻结", value: "冻结" }
      ],
      positionNameFilters: [
        { text: "测试", value: "测试" },
        { text: "测试2", value: "测试2" },
        { text: "测试3", value: "测试3" }
      ],
      roleNameFilters: [
        { text: "测试", value: "测试" },
        { text: "测试2", value: "测试2" },
        { text: "测试3", value: "测试3" }
      ],
      start2End: [],
      openEdit: false,
      rowData: {},
      getHasChildren: false,
      pId: "",
      departmentIds: [], // 查询时需要收集的id
      name: "",
      // nameOptions: ["张三", "李四", "王五"],
      targetId: "",
      permissions: []
    };
  },
  computed: {
    ...mapState({
      tableData: state => state.users
    }),
    ...departMapState({
      pIdOptions: state => state.departOps
    }),
    nameOptions() {
      const plainArray = [];
      this.tableData.forEach(item => {
        plainArray.push(item.name);
      });
      return Array.from(new Set(plainArray));
    },
    hasChildren: {
      set(newValue) {
        if (newValue === true && this.pId) {
          this.getHasChildren = true;
        } else {
          this.getHasChildren = false;
        }
      },
      get() {
        return this.getHasChildren;
      }
    }
  },
  components: {
    RangeDatePicker,
    ListTemplate,
    SuggestInput,
    Edit
  },
  watch: {
    pId(newValue) {
      if (!newValue) {
        this.hasChildren = false;
      } else {
        this.hasChildren = true;
      }
    }
  },
  methods: {
    statusNameFilterFun(value, row) {
      return row.statusName === value;
    },
    positionNameFilterFun(value, row) {
      if (row.positionId) {
        return row.positionId.name === value;
      }
      return false;
    },
    roleNameFilterFun(value, row) {
      return row.roleIds.some(role => role.name === value);
    },
    formatter(row) {
      const { entryTime } = row;
      return formatTime(
        new Date(entryTime).getTime() / 1000,
        "{y}年{m}月{d}日"
      );
    },
    showEdit(rowData) {
      this.permissions = rowData.permissions;
      this.targetId = rowData._id;
      this.openEdit = true;
    },
    setPermissions(permissions) {
      permissions = Array.from(new Set(permissions));

      const addPermissions = [];
      const noPermissions = [];

      permissions.forEach(permission => {
        if (!this.permissions.includes(permission)) {
          addPermissions.push(permission);
        }
      });

      this.permissions.forEach(permission => {
        if (!permissions.includes(permission)) {
          noPermissions.push(permission);
        }
      });

      this.$store
        .dispatch("role/changePermissions", {
          _id: this.targetId,
          addPermissions,
          noPermissions
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "修改用户权限成功"
          });
          this.openEdit = false;
        })
        .catch(e => {
          console.log(e);
          this.$message({
            type: "error",
            message: "修改用户权限失败，请检查网络"
          });
        });
    },
    query() {
      const { name, pId, pIdOptions } = this;
      if (this.hasChildren) {
        this._deepColletId(pIdOptions, false);
      } else {
        this.departmentIds = [pId];
      }
      const query = {
        name,
        departmentIds: this.departmentIds.join(","),
        startTime: this.start2End[0],
        endTime: this.start2End[1]
      };
      this.$store
        .dispatch("user/find", query)
        .then(() => {
          this.$message({
            type: "success",
            message: "查询用户成功"
          });
        })
        .catch(() => {
          console.log("查询用户列表失败");
        });
    },
    _deepColletId(pIdOptions, isCollected) {
      for (const pIdOption of pIdOptions) {
        if (pIdOption.value === this.pId || isCollected) {
          this.departmentIds.push(pIdOption.value);
          if (pIdOption.children && pIdOption.children.length > 0) {
            this._deepColletId(pIdOption.children, true);
          }
        } else {
          if (pIdOption.children && pIdOption.children.length > 0) {
            this._deepColletId(pIdOption.children, false);
          }
        }
      }
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