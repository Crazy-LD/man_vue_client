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
            v-permission="36"
            type="danger"
            icon="el-icon-delete"
            size="medium"
            round
            @click="batchDel"
          >批量删除</el-button>
        </div>
        <div class="item">
          <el-button
            type="success"
            icon="el-icon-s-promotion"
            size="medium"
            round
            v-permission="37"
            @click="expRec"
          >导出记录</el-button>
        </div>
        <div class="item">
          <SuggestInput
            placeholder="审计主体"
            :inputValue.sync="name"
            :inputValueOptions="nameOptions"
          />
        </div>
        <div class="item">
          <RangeDatePicker startPlace="开始审计时间" endPlace="结束审计时间" :start2End.sync="start2End" />
        </div>
        <div class="item">
          <el-button type="primary" icon="el-icon-search" size="medium" round @click="query">查询</el-button>
        </div>
      </template>
      <template #restColumn>
        <el-table-column
          prop="status"
          label="审计状态"
          width="100"
          :filters="statusFilters"
          :filter-method="statusFilterFun"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === '正在审计' ? 'primary' : 'success'"
              disable-transitions
            >{{scope.row.status}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="result"
          label="审计结果"
          width="100"
          :filters="resultFilters"
          :filter-method="resultFilterFun"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.result === '未通过' ? 'primary' : 'success'"
              disable-transitions
            >{{scope.row.result}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="审计时间" sortable width="180"></el-table-column>
        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button v-permission="35" size="mini" @click="edit(scope.row)">修改</el-button>
            <el-button v-permission="36" size="mini" type="danger" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </ListTemplate>
    <el-dialog title="修改信息" :visible.sync="openEdit">
      <el-form :model="form">
        <el-form-item label="审计主体" label-width="120px">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="审计时间" label-width="120px">
          <el-input v-model="form.time"></el-input>
        </el-form-item>
        <el-form-item label="审计地点" label-width="120px">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="审计事项" label-width="120px">
          <el-input v-model="form.matter"></el-input>
        </el-form-item>
        <el-form-item label="审计详情" label-width="120px">
          <el-input type="textarea" v-model="form.detail"></el-input>
        </el-form-item>
        <el-form-item label="审计状态" label-width="120px">
          <el-select v-model="form.status" placeholder="请选择审计状态">
            <el-option label="正在审计" value="正在审计"></el-option>
            <el-option label="已审核" value="已审核"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审计结果" label-width="120px">
          <el-select v-model="form.result" placeholder="请选择审计结果">
            <el-option label="正在审计" value="正在审计"></el-option>
            <el-option label="已审核" value="已审核"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openEdit = false">取 消</el-button>
        <el-button type="primary" @click="openEdit = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SuggestInput from "../../components/suggest-input/suggest-input";
import RangeDatePicker from "../../components/range-date-picker/range-date-picker";
import ListTemplate from "../../components/list_template/list_template";
export default {
  data() {
    return {
      /* 搜索的模拟数据 */
      name: "", // 审计主体
      // nameOptions: ["张三", "李四", "王五"], // 所有的审计主体

      status: "", // 审计状态
      statusFilters: [
        { text: "正在审计", value: "正在审计" },
        { text: "已审计", value: "已审计" }
      ],
      result: "", // 审计结果
      resultFilters: [
        { text: "通过", value: "通过" },
        { text: "未通过", value: "未通过" }
      ],

      start2End: [], // 开始到结束的时间
      /* 表单的模拟数据 */
      tableData: [
        {
          time: "2016-05-05",
          address: "重庆市南岸区南山街道重庆邮电大学",
          name: "待定",
          matter: "待定",
          detail: "审计详细审计详细审计详细审计详细审计详细审计详细",
          status: "正在审计",
          result: "通过"
        },
        {
          time: "2016-05-04",
          address: "重庆市南岸区南山街道重庆邮电大学",
          name: "待定",
          matter: "待定",
          detail: "审计详细审计详细审计详细审计详细审计详细审计详细",
          status: "正在审计",
          result: "通过"
        },
        {
          time: "2016-05-03",
          address: "重庆市南岸区南山街道重庆邮电大学",
          name: "待定",
          matter: "待定",
          detail: "审计详细审计详细审计详细审计详细审计详细审计详细",
          status: "正在审计",
          result: "通过"
        },
        {
          time: "2016-05-03",
          address: "重庆市南岸区南山街道重庆邮电大学",
          name: "待定",
          matter: "待定",
          detail: "审计详细审计详细审计详细审计详细审计详细审计详细",
          status: "正在审计",
          result: "通过"
        },
        {
          time: "2016-05-03",
          address: "重庆市南岸区南山街道重庆邮电大学",
          name: "待定",
          matter: "待定",
          detail: "审计详细审计详细审计详细审计详细审计详细审计详细",
          status: "已审计",
          result: "通过"
        },
        {
          time: "2016-05-03",
          address: "重庆市南岸区南山街道重庆邮电大学",
          name: "待定",
          matter: "待定",
          detail: "审计详细审计详细审计详细审计详细审计详细审计详细",
          status: "正在审计",
          result: "通过"
        },
        {
          time: "2016-05-03",
          address: "重庆市南岸区南山街道重庆邮电大学",
          name: "待定",
          matter: "待定",
          detail: "审计详细审计详细审计详细审计详细审计详细审计详细",
          status: "正在审计",
          result: "通过"
        },
        {
          time: "2016-05-03",
          address: "重庆市南岸区南山街道重庆邮电大学",
          name: "待定",
          matter: "待定",
          detail: "审计详细审计详细审计详细审计详细审计详细审计详细",
          status: "已审计",
          result: "通过"
        },
        {
          time: "2016-05-03",
          address: "重庆市南岸区南山街道重庆邮电大学",
          name: "待定",
          matter: "待定",
          detail: "审计详细审计详细审计详细审计详细审计详细审计详细",
          status: "正在审计",
          result: "通过"
        },
        {
          time: "2016-05-12",
          address: "重庆市南岸区南山街道重庆邮电大学",
          name: "待定",
          matter: "待定",
          detail: "审计详细审计详细审计详细审计详细审计详细审计详细",
          status: "正在审计",
          result: "未通过"
        },
        {
          time: "2016-05-01",
          address: "重庆市南岸区南山街道重庆邮电大学",
          name: "待定",
          matter: "待定",
          detail: "审计详细审计详细审计详细审计详细审计详细审计详细",
          status: "已审计",
          result: "未通过"
        },
        {
          time: "2016-05-02",
          address: "重庆市南岸区南山街道重庆邮电大学",
          name: "待定",
          matter: "待定",
          detail: "审计详细审计详细审计详细审计详细审计详细审计详细",
          status: "已审计",
          result: "未通过"
        },
        {
          time: "2016-05-03",
          address: "重庆市南岸区南山街道重庆邮电大学",
          name: "待定",
          matter: "待定",
          detail: "审计详细审计详细审计详细审计详细审计详细审计详细",
          status: "正在审计",
          result: "未通过"
        },
        {
          time: "2016-05-04",
          address: "重庆市南岸区南山街道重庆邮电大学",
          name: "待定",
          matter: "待定",
          detail: "审计详细审计详细审计详细审计详细审计详细审计详细",
          status: "正在审计",
          result: "未通过"
        }
      ],
      uniTableHeads: [
        {
          prop: "name",
          label: "审计主体",
          minWidth: 120
        },
        {
          prop: "matter",
          label: "审计事项",
          minWidth: 120
        },
        {
          prop: "address",
          label: "审计地点",
          minWidth: 120
        },
        {
          prop: "detail",
          label: "审计详细",
          minWidth: 120
        }
      ],
      multipleSelection: [],

      // 编辑对话框
      openEdit: false,
      form: {
        name: "",
        address: "",
        matter: "",
        status: "",
        detail: "",
        time: "",
        result: ""
      }
    };
  },
  computed: {
    nameOptions() {
      const plainArray = [];
      this.tableData.forEach(item => {
        plainArray.push(item.name);
      });
      return Array.from(new Set(plainArray));
    }
  },
  components: {
    SuggestInput,
    RangeDatePicker,
    ListTemplate
  },
  methods: {
    /* 表单 */
    resultFilterFun(value, row) {
      return row.result === value;
    },
    statusFilterFun(value, row) {
      return row.status === value;
    },
    edit(row) {
      // 得到当前行的数据
      console.log(row);
      this.openEdit = true;
    },
    del() {
      console.log("删除");
    },
    batchDel() {
      console.log("批量删除", this.multipleSelection);
    },
    expRec() {
      console.log("导出记录");
    },
    query() {
      console.log("查询");
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

