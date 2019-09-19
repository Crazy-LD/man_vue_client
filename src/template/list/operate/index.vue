<template>

  <el-table-column label="操作" min-width="120">
    <template slot-scope="scope">
      <el-button size="mini" type='info' @click="detail(scope.row)">详情</el-button>
    </template>
  </el-table-column>
  
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style>
</style>