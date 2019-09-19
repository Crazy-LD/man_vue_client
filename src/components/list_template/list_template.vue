<template>
  <el-container>
    <el-header height="auto">
      <slot name="header"></slot>
    </el-header>

    <el-main>
      <el-scrollbar>
        <el-table
          ref="multipleTable"
          :data="currentTalbeData"
          tooltip-effect="light"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-if="!hiddenCheck"
            type="selection"
            :index="indexMethod"
            :min-width="50"
          ></el-table-column>
          <el-table-column type="index" :index="indexMethod" label="序号" :min-width="50"></el-table-column>
          <el-table-column
            v-for="(tableHead, index) in uniTableHeads"
            :key="index"
            :type="tableHead.type"
            :index="indexMethod"
            :label="tableHead.label"
            :min-width="tableHead.minWidth"
            :prop="tableHead.prop"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <slot name="restColumn"></slot>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          :pager-count="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length"
          background
        ></el-pagination>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: {
    tableData: {
      // 表格的数据,格式:[{propName: propValue}]
      type: Array,
      required: true
    },
    uniTableHeads: {
      // 同一格式的表格头,格式:[{type: string, minWidth: number, label: string}]
      type: Array,
      required: true
    },
    multipleSelection: {
      type: Array,
      default: []
    },
    hiddenCheck: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      /* 分页的模拟数据 */
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    currentTalbeData() {
      const { currentPage, pageSize, tableData } = this;
      return tableData.filter((item, index) => {
        return (
          (currentPage - 1) * pageSize <= index &&
          index < currentPage * pageSize
        );
      });
    }
  },
  methods: {
    /* 表单 */
    handleSelectionChange(val) {
      // 收集勾选的每一行
      this.$emit("update:multipleSelection", val);
    },
    /* 分页的函数 */
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    indexMethod(index) {
      const { currentPage, pageSize } = this;
      return (currentPage - 1) * pageSize + index + 1;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-container {
  background: white;
  width: 100%;
  height: 100%;
  padding: 20px;
  .el-header {
    display: flex;
    flex-wrap: wrap;
    // .item {
    //   margin: 0px 10px 20px 0px;
    // }
  }
}
// .el-autocomplete {
//   min-width: 200px;
// }
// .el-select {
//   min-width: 200px;
// }
.el-pagination {
  margin-top: 20px;
}
</style>