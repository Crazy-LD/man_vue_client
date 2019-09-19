<template>
  <ListTemplate
    :tableData="tableData"
    :uniTableHeads="uniTableHeads"
    :multipleSelection.sync="multipleSelection"
  >
    <template #header>
      <div class="item">
        <el-button
          v-permission="44"
          type="warning"
          icon="el-icon-circle-plus-outline"
          size="medium"
          round
          @click="add"
        >新增</el-button>
      </div>
      <div class="item">
        <SuggestInput
          placeholder="用户姓名"
          :inputValue.sync="userName"
          :inputValueOptions="userNameOptions"
        />
      </div>
      <div class="item">
        <RangeDatePicker startPlace="操作开始时间" endPlace="操作结束时间" :start2End.sync="start2End" />
      </div>
      <div class="item">
        <el-button type="primary" icon="el-icon-search" size="medium" round @click="query">查询</el-button>
      </div>
    </template>

    <template #restColumn>
      <el-table-column
        prop="operType"
        label="操作类型"
        width="100"
        :filters="operTypeFilters"
        :filter-method="operTypeFilterFun"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.operType === '操作类型1' ? 'primary' : 'success'"
            disable-transitions
          >{{scope.row.operType}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="operFun"
        label="操作功能"
        width="100"
        :filters="operFunFilters"
        :filter-method="operFunFilterFun"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.operFun === '操作功能1' ? 'primary' : 'success'"
            disable-transitions
          >{{scope.row.operFun}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operTime" label="操作时间" sortable width="180"></el-table-column>
    </template>
  </ListTemplate>
</template>

<script>
import SuggestInput from "../../../components/suggest-input/suggest-input";
import RangeDatePicker from "../../../components/range-date-picker/range-date-picker";
import ListTemplate from "../../../components/list_template/list_template";
export default {
  data() {
    return {
      /* 搜索的模拟数据 */
      userName: "", // 用户姓名
      userNameOptions: ["张三", "李四", "王五"], // 所有的用户姓名

      operType: "", // 操作类型
      operTypeFilters: [
        { text: "操作类型1", value: "操作类型1" },
        { text: "操作类型2", value: "操作类型2" }
      ],

      operFun: "", // 操作功能
      operFunFilters: [
        { text: "操作功能1", value: "操作功能1" },
        { text: "操作功能2", value: "操作功能2" }
      ],

      start2End: [], // 开始到结束的时间
      /* 表单的模拟数据 */
      tableData: [
        {
          userName: "王小虎",
          userIPAddr: "192.23.43.1",
          operArg: "操作参数1",
          operExamID: "23",
          operResult: "成功",
          operTime: "2016-05-05",
          operType: "操作类型1",
          operFun: "操作功能2"
        },
        {
          userName: "王小虎",
          userIPAddr: "192.23.43.1",
          operArg: "操作参数1",
          operExamID: "23",
          operResult: "成功",
          operTime: "2016-05-05",
          operType: "操作类型2",
          operFun: "操作功能1"
        },
        {
          userName: "王小虎",
          userIPAddr: "192.23.43.1",
          operArg: "操作参数1",
          operExamID: "23",
          operResult: "成功",
          operTime: "2016-05-05",
          operType: "操作类型2",
          operFun: "操作功能2"
        },
        {
          userName: "王小虎",
          userIPAddr: "192.23.43.1",
          operArg: "操作参数1",
          operExamID: "23",
          operResult: "成功",
          operTime: "2016-05-05",
          operType: "操作类型1",
          operFun: "操作功能1"
        },
        {
          userName: "王小虎",
          userIPAddr: "192.23.43.1",
          operArg: "操作参数1",
          operExamID: "23",
          operResult: "成功",
          operTime: "2016-05-05",
          operType: "操作类型1",
          operFun: "操作功能2"
        },
        {
          userName: "王小虎",
          userIPAddr: "192.23.43.1",
          operArg: "操作参数1",
          operExamID: "23",
          operResult: "成功",
          operTime: "2016-05-05",
          operType: "操作类型1",
          operFun: "操作功能2"
        }
      ],
      uniTableHeads: [
        {
          prop: "userName",
          label: "用户姓名",
          minWidth: 120
        },
        {
          prop: "userIPAddr",
          label: "用户IP地址",
          minWidth: 120
        },
        {
          prop: "operArg",
          label: "操作参数",
          minWidth: 120
        },
        {
          prop: "operExamID",
          label: "操作实例ID",
          minWidth: 120
        },
        {
          prop: "operResult",
          label: "操作结果",
          minWidth: 120
        }
      ],
      multipleSelection: []
    };
  },
  components: {
    SuggestInput,
    RangeDatePicker,
    ListTemplate
  },
  methods: {
    /* 表单 */
    operTypeFilterFun(value, row) {
      return row.operType === value;
    },
    operFunFilterFun(value, row) {
      return row.operFun === value;
    },
    batchDel() {
      console.log("批量删除", this.multipleSelection);
    },
    query() {
      console.log("查询");
    },
    add() {
      console.log("增加");
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