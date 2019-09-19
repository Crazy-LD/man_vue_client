<template>
  <el-form-item prop="abcdefg" label="成立时间" label-width='120px'>
    <DatePicker :value.sync="form.abcdefg" />
  </el-form-item>
</template>

<script>
import DatePicker from "../../components/date-picker/data-picker";
export default {
  data() {
    return {};
  }
};
</script>

<style>
</style>