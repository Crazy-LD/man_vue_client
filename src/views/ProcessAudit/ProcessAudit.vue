<template>
  <ListTemplate
    :tableData="tableData"
    :uniTableHeads="uniTableHeads"
    :multipleSelection.sync="multipleSelection"
  >
    <template #header>
      <div class="item">
        <el-button
          v-permission="39"
          type="warning"
          icon="el-icon-circle-plus-outline"
          size="medium"
          round
          @click="add"
        >新增</el-button>
      </div>
      <div class="item">
        <SuggestInput placeholder="申请人" :inputValue.sync="name" :inputValueOptions="nameOptions" />
      </div>
      <div class="item">
        <RangeDatePicker startPlace="流程开始时间" endPlace="流程结束时间" :start2End.sync="start2End" />
      </div>
      <div class="item">
        <el-button type="primary" icon="el-icon-search" size="medium" round @click="query">查询</el-button>
      </div>
    </template>
    <template #restColumn>
      <el-table-column
        prop="examStatus"
        label="流程实例状态"
        width="150"
        :filters="examStatusFilters"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.examStatus === '实例状态1' ? 'primary' : 'success'"
            disable-transitions
          >{{scope.row.examStatus}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="流程开始时间" sortable width="180"></el-table-column>
      <el-table-column prop="endTime" label="流程结束时间" sortable width="180"></el-table-column>

      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="detail(scope.row)">详情</el-button>
          <el-button
            v-permission="40"
            size="mini"
            type="success"
            @click="historyPostil(scope.row)"
          >历史批注</el-button>
          <el-button v-permission="41" size="mini" type="primary" @click="procPic(scope.row)">流程图</el-button>
        </template>
      </el-table-column>
    </template>
  </ListTemplate>
</template>

<script>
import SuggestInput from "../../components/suggest-input/suggest-input";
import RangeDatePicker from "../../components/range-date-picker/range-date-picker";
import ListTemplate from "../../components/list_template/list_template";
export default {
  data() {
    return {
      /* 搜索的模拟数据 */
      name: "", // 申请人
      // nameOptions: ["张三", "李四", "王五"],

      examStatus: "", // 实例状态
      examStatusFilters: [
        { text: "实例状态1", value: "实例状态1" },
        { text: "实例状态2", value: "实例状态2" }
      ],
      start2End: [], // 开始到结束的时间
      /* 表单的模拟数据 */
      tableData: [
        {
          startTime: "2016-05-05",
          endTime: "2016-05-05",
          name: "王小虎",
          examID: "34",
          examName: "实例名称1",
          examStatus: "通过"
        },
        {
          startTime: "2016-05-05",
          endTime: "2016-05-05",
          name: "王小虎",
          examID: "34",
          examName: "实例名称1",
          examStatus: "通过"
        },
        {
          startTime: "2016-05-05",
          endTime: "2016-05-05",
          name: "王小虎",
          examID: "34",
          examName: "实例名称1",
          examStatus: "通过"
        },
        {
          startTime: "2016-05-05",
          endTime: "2016-05-05",
          name: "王小虎",
          examID: "34",
          examName: "实例名称1",
          examStatus: "通过"
        }
      ],
      uniTableHeads: [
        {
          prop: "name",
          label: "申请人",
          minWidth: 50
        },
        {
          prop: "examName",
          label: "实例名称",
          minWidth: 50
        },
        {
          prop: "examID",
          label: "实例ID",
          minWidth: 50
        }
      ],
      multipleSelection: []
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
    filterTag(value, row) {
      return row.examStatus === value;
    },
    batchDel() {
      console.log("批量删除", this.multipleSelection);
    },
    detail(row) {
      // 得到当前行的数据
      console.log(row);
    },
    add() {
      console.log("增加");
    },
    query() {
      console.log("查询");
    },
    historyPostil() {
      console.log("历史批注");
    },
    procPic() {
      console.log("流程图");
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