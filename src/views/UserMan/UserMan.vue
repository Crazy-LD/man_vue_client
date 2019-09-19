<template>
  <div>
    <ListTemplate
      :tableData="tableData"
      :uniTableHeads="uniTableHeadsFiletered"
      :multipleSelection.sync="multipleSelection"
      ref="listTem"
    >
      <template #header>
        <div class="item">
          <el-button
            type="warning"
            icon="el-icon-circle-plus-outline"
            size="medium"
            round
            v-permission="2"
            @click="showAdd(true)"
          >新增用户</el-button>
        </div>
        <div class="item">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="medium"
            round
            v-permission="4"
            @click="batchChangeStatus(1)"
          >批量注销</el-button>
        </div>
        <div class="item">
          <el-button
            type="primary"
            icon="el-icon-warning-outline"
            size="medium"
            round
            v-permission="5"
            @click="batchChangeStatus(2)"
          >批量冻结</el-button>
        </div>
        <div class="item">
          <el-button
            type="success"
            icon="el-icon-s-promotion"
            size="medium"
            round
            @click="batchChangeStatus(0)"
          >批量恢复</el-button>
        </div>
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
        <div class="item">
          <el-button
            type="success"
            icon="el-icon-s-promotion"
            size="medium"
            round
            @click="exportExcel"
          >导出记录</el-button>
        </div>
        <br />
        <div class="item" style="width:100%; line-height:40px">
          <el-checkbox-group v-model="checkedHeaders">
            <el-checkbox
              v-for="head in uniTableHeads"
              :label="head.prop"
              :key="head.prop"
            >{{head.label}}</el-checkbox>
          </el-checkbox-group>
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
            <el-button size="mini" v-permission="3" @click="showAdd(false, scope.row)">修改</el-button>
            <el-button
              v-show="scope.row.status !== 1"
              size="mini"
              type="danger"
              v-permission="4"
              @click="changeStatus(scope.row,1)"
            >注销</el-button>
            <el-button
              v-show="scope.row.status !== 2"
              size="mini"
              type="primary"
              v-permission="5"
              @click="changeStatus(scope.row,2)"
            >冻结</el-button>
            <el-button
              v-show="scope.row.status !== 0"
              size="mini"
              type="success"
              v-permission="47"
              @click="changeStatus(scope.row,0)"
            >恢复</el-button>
            <el-button size="mini" type="info" @click="showDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </template>
    </ListTemplate>
    <template v-if="openAdd === true">
      <Add :openAdd.sync="openAdd" :isAdd="isAdd" :rowData="rowData" />
    </template>
    <template v-if="openDetail === true">
      <Detail :openDetail.sync="openDetail" :details="details" />
    </template>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
import RangeDatePicker from "../../components/range-date-picker/range-date-picker";
import ListTemplate from "../../components/list_template/list_template";
import SuggestInput from "../../components/suggest-input/suggest-input";
import Detail from "../../components/Detail/Detail";
import { export2ExcelCommon } from "../../utils/excel";

import Add from "./Add";
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
          prop: "phone",
          label: "电话号码"
        },
        {
          prop: "email",
          label: "Email"
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
      openAdd: false, // 是否打开增加
      openDetail: false, // 是否打开详情
      isAdd: true, // 是否为添加
      rowData: {},
      getHasChildren: false,
      pId: "",
      departmentIds: [], // 查询时需要收集的id
      name: "",
      checkedHeaders: ["username", "name", "sex"]
    };
  },
  computed: {
    ...mapState({
      tableData: state => state.users
    }),
    ...departMapState({
      pIdOptions: state => state.departOps
    }),
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
    },
    details() {
      const details = [];
      this.uniTableHeads.forEach(item => {
        const props = item.prop.split(".");
        let i = 0;
        let value = this.rowData[props[i]];
        while (typeof value === "object" && i < props.length - 1) {
          i++;
          value = value[props[i]];
        }
        const detail = {
          label: item.label,
          value
        };
        details.push(detail);
      });

      details.push({ label: "用户状态", value: this.rowData.statusName });

      details.push({
        label: "职位",
        value: this.rowData.positionId ? this.rowData.positionId.name : ""
      });
      let roleValue = "";
      for (const item of this.rowData.roleIds) {
        roleValue += item.name + "、";
      }
      details.push({
        label: "角色",
        value: roleValue
      });
      const dateString = formatTime(
        new Date(this.rowData.entryTime).getTime() / 1000,
        "{y}年{m}月{d}日"
      );
      details.push({
        label: "入职时间",
        value: dateString
      });
      return details;
    },
    nameOptions() {
      const plainArray = [];
      this.tableData.forEach(item => {
        plainArray.push(item.name);
      });
      return Array.from(new Set(plainArray));
    },
    uniTableHeadsFiletered() {
      return this.uniTableHeads.filter(item =>
        this.checkedHeaders.includes(item.prop)
      );
    }
  },
  components: {
    RangeDatePicker,
    ListTemplate,
    Add,
    Detail,
    SuggestInput
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
    showAdd(isAdd, rowData) {
      this.isAdd = isAdd;
      if (isAdd) {
        this.rowData = { entryTime: new Date() };
      } else {
        const tempRowData = { ...rowData };
        tempRowData.entryTime = new Date(rowData.entryTime);
        tempRowData.roleIds = tempRowData.roleIds.reduce(
          (preArray, curItem) => {
            preArray.push(curItem._id);
            return preArray;
          },
          []
        );
        this.rowData = tempRowData;
      }
      this.openAdd = true;
    },
    showDetail(rowData) {
      this.rowData = rowData;
      this.openDetail = true;
    },
    changeStatus(row, status) {
      const data = { ids: [row._id], status };
      this.$store
        .dispatch("user/batchChangeStatus", data)
        .then(response => {
          const { count } = response.data;
          this.$message({
            type: "success",
            message: `成功修改${count}个用户的信息`
          });
        })
        .catch(e => {
          console.log(e);
        });
      console.log(row._id, status);
    },
    batchChangeStatus(status) {
      const { multipleSelection } = this;
      const data = { status };
      const ids = [];
      let isCan = true;
      if (multipleSelection.length === 0) {
        this.$message({
          type: "info",
          message: "你没有勾选任何选项"
        });
        return;
      }
      multipleSelection.forEach(item => {
        if (item.status === status) {
          isCan = false;
        }
        ids.push(item._id);
      });
      if (isCan) {
        data.ids = ids;
        this.$store
          .dispatch("user/batchChangeStatus", data)
          .then(response => {
            const { count } = response.data;
            this.$message({
              type: "success",
              message: `成功修改${count}个用户的信息`
            });
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        this.$message({
          type: "error",
          message: "选择的用户状态冲突"
        });
      }
    },
    query() {
      const { name, pId, pIdOptions } = this;
      if (this.hasChildren) {
        this._deepColletId(pIdOptions, false);
      } else {
        this.departmentIds = [pId];
      }
      console.log(this.departmentIds);
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
          console.log("shouji");
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
    },
    exportExcel() {
      export2ExcelCommon({
        tableDom: this.$refs.listTem.$refs.multipleTable.$el
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

