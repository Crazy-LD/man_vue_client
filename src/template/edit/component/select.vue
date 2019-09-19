<template>
  <el-form-item prop="abcdefg" label="审计状态" label-width='120px'>
    <el-select v-model="form.abcdefg" placeholder="请选择审计状态">
      <el-option label="正在审计" value="正在审计"></el-option>
    </el-select>
  </el-form-item>
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