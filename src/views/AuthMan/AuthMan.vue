<template>
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane v-permission="33" label="角色管理" name="role">
      <RoleTab />
    </el-tab-pane>
    <el-tab-pane v-permission="32" label="用户管理" name="user">
      <UserTab />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import RoleTab from "./RoleTab";
import UserTab from "./UserTab";
export default {
  data() {
    return {
      activeName: "role"
    };
  },
  components: {
    UserTab,
    RoleTab
  }
};
</script>

<style lang="scss" scoped>
</style>