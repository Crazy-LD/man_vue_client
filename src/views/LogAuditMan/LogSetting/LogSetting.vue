<template>
  <ListTemplate
    :tableData="tableData"
    :uniTableHeads="uniTableHeads"
    :multipleSelection.sync="multipleSelection"
  >
    <template #restColumn>
      <el-table-column label="操作" min-width="120">
        <template slot-scope="scope">
          <el-button v-permission="46" size="mini" @click="edit(scope.row)">配置</el-button>
        </template>
      </el-table-column>
    </template>
  </ListTemplate>
</template>

<script>
import ListTemplate from "../../../components/list_template/list_template";
export default {
  data() {
    return {
      /* 表单的模拟数据 */
      tableData: [
        {
          name: "角色名称1",
          saveTime: "2019-8-11"
        },
        {
          name: "角色名称1",
          saveTime: "2019-8-11"
        },
        {
          name: "角色名称1",
          saveTime: "2019-8-11"
        },
        {
          name: "角色名称1",
          saveTime: "2019-8-11"
        },
        {
          name: "角色名称1",
          saveTime: "2019-8-11"
        }
      ],
      uniTableHeads: [
        {
          prop: "name",
          label: "角色名",
          minWidth: 120
        },
        {
          prop: "saveTime",
          label: "日志保存时间",
          minWidth: 120
        }
      ],
      multipleSelection: []
    };
  },
  components: {
    ListTemplate
  },
  methods: {
    edit(row) {
      console.log("配置", row);
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