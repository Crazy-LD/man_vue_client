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
            v-permission="12"
            @click="showAdd(true)"
          >新增部门</el-button>
        </div>
        <div class="item">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="medium"
            round
            v-permission="14"
            @click="batchChangeStatus(1)"
          >批量注销</el-button>
        </div>
        <div class="item">
          <el-button
            type="success"
            icon="el-icon-s-promotion"
            size="medium"
            round
            v-permission="15"
            @click="batchChangeStatus(0)"
          >批量恢复</el-button>
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
          prop="statusName"
          label="部门状态"
          width="100"
          :filters="statusNameFilters"
          :filter-method="statusNameFilterFun"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.statusName === '正常' ? 'success' : 'danger'"
              disable-transitions
            >{{scope.row.statusName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="dateOfEstablishment"
          label="成立时间"
          sortable
          width="150"
          :formatter="formatter"
        ></el-table-column>
        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button v-permission="13" size="mini" @click="showAdd(false, scope.row)">修改</el-button>
            <el-button
              v-show="scope.row.status === 0"
              size="mini"
              type="danger"
              v-permission="14"
              @click="changeStatus(scope.row,1)"
            >注销</el-button>
            <el-button
              v-permission="15"
              v-show="scope.row.status !== 0"
              size="mini"
              type="success"
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
import Add from "./Add";
import Detail from "../../components/Detail/Detail";
import { formatTime } from "../../utils";
const { mapState } = createNamespacedHelpers("department");
export default {
  mounted() {
    this.$store.dispatch("department/find").catch(() => {
      console.log("获取部门列表失败");
    });
    if (this.pIdOptions.length === 0) {
      this.$store.dispatch("department/getDepartOps").catch(() => {
        console.log("获取部门选项失败");
      });
    }
  },
  data() {
    return {
      uniTableHeads: [
        {
          prop: "name",
          label: "部门名称"
        },
        {
          prop: "responsibility",
          label: "部门主要职责"
        },
        {
          prop: "pId.name",
          label: "父部门"
        }
      ],
      multipleSelection: [],
      statusNameFilters: [
        { text: "正常", value: "正常" },
        { text: "注销", value: "注销" }
      ],
      start2End: [],
      openAdd: false, // 是否打开增加
      openDetail: false, // 是否打开详情
      isAdd: true, // 是否为添加
      rowData: {},
      getHasChildren: false,
      pId: "",
      ids: [] // 查询时需要收集的id
    };
  },
  computed: {
    ...mapState({
      tableData: state => state.departments,
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
        while (typeof value === "object" && i < props.length - 1 && value) {
          i++;
          value = value[props[i]];
        }
        const detail = {
          label: item.label,
          value
        };
        details.push(detail);
      });
      const dateString = formatTime(
        new Date(this.rowData.dateOfEstablishment).getTime() / 1000,
        "{y}年{m}月{d}日"
      );
      details.push({ label: "部门状态", value: this.rowData.statusName });
      details.push({
        label: "部门成立时间",
        value: dateString
      });
      details.push({
        label: "部门介绍",
        value: this.rowData.introduce
      });
      return details;
    }
  },
  components: {
    RangeDatePicker,
    ListTemplate,
    Add,
    Detail
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
    formatter(row) {
      const { dateOfEstablishment } = row;
      return formatTime(
        new Date(dateOfEstablishment).getTime() / 1000,
        "{y}年{m}月{d}日"
      );
    },
    showAdd(isAdd, rowData) {
      this.isAdd = isAdd;
      if (isAdd) {
        this.rowData = { dateOfEstablishment: new Date() };
      } else {
        const tempRowData = { ...rowData };
        tempRowData.dateOfEstablishment = new Date(
          tempRowData.dateOfEstablishment
        );
        this.rowData = tempRowData;
      }
      this.openAdd = true;
    },
    showDetail(rowData) {
      console.log("laiel");
      this.rowData = rowData;
      this.openDetail = true;
    },
    changeStatus(row, status) {
      const data = { ids: [row._id], status };
      this.$store
        .dispatch("department/batchChangeStatus", data)
        .then(response => {
          const { count } = response.data;
          this.$message({
            type: "success",
            message: `成功修改${count}个部门的信息`
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
      multipleSelection.forEach(item => {
        if (item.status === status) {
          isCan = false;
        }
        ids.push(item._id);
      });
      if (isCan) {
        data.ids = ids;
        this.$store
          .dispatch("department/batchChangeStatus", data)
          .then(response => {
            const { count } = response.data;
            this.$message({
              type: "success",
              message: `成功修改${count}个部门的信息`
            });
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        this.$message({
          type: "error",
          message: "选择的部门状态冲突"
        });
      }
    },
    query() {
      const { pId, pIdOptions } = this;
      if (this.hasChildren) {
        this._deepColletId(pIdOptions, false);
      } else {
        this.ids = [pId];
      }
      console.log(this.ids);
      const query = {
        ids: this.ids.join(","),
        startTime: this.start2End[0],
        endTime: this.start2End[1]
      };
      this.$store
        .dispatch("department/find", query)
        .then(() => {
          this.$message({
            type: "success",
            message: "查询部门成功"
          });
        })
        .catch(() => {
          console.log("查询部门列表失败");
        });
    },
    _deepColletId(pIdOptions, isCollected) {
      for (const pIdOption of pIdOptions) {
        if (pIdOption.value === this.pId || isCollected) {
          console.log("shouji");
          this.ids.push(pIdOption.value);
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

