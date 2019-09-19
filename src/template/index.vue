<template>
  <div>
    <ListTemplate
      :tableData="tableData"
      :uniTableHeads="uniTableHeads"
      :multipleSelection.sync="multipleSelection"
    >
      <template #header></template>
      <template #restColumn></template>
    </ListTemplate>
  </div>
</template>

<script>
import ListTemplate from "../../components/list_template/list_template";

export default {
  data() {
    return {
      tableData: [
        {
          time: "2016-05-05"
        }
      ],
      uniTableHeads: [
        {
          prop: "subject",
          label: "审计主体",
          minWidth: 120
        }
      ],
      multipleSelection: []
    };
  },
  components: {
    ListTemplate
  },
  methods: {}
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