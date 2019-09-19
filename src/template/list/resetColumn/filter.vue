<template>
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
</template>

<script>
export default {
  data() {
    return {
      statusFilters: [
        { text: "正在审计", value: "正在审计" },
        { text: "已审计", value: "已审计" }
      ]
    };
  },
  methods: {
    statusFilterFun(value, row) {
      return row.status === value;
    }
  }
};
</script>

<style>
</style>