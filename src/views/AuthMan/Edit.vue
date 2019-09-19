<template>
  <el-dialog title="修改权限" :visible="openEdit" v-el-drag-dialog v-on:update:visible="close($event)">
    <el-tree
      :data="permissionOps"
      show-checkbox
      node-key="code"
      :default-checked-keys="permissions"
      :expand-on-click-node="false"
      ref="tree"
    ></el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import elDragDialog from "../../directive/el-drag-dialog";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("permission");
export default {
  mounted() {
    if (this.permissionOps.length === 0) {
      this.$store
        .dispatch("permission/getPermissionOps")
        .then(() => {
          console.log("数据请求成功");
        })
        .catch(e => {
          console.log(e);
          this.$message({
            type: "error",
            message: "获取权限列表失败"
          });
        });
    }
  },
  directives: {
    elDragDialog
  },
  props: {
    openEdit: {
      type: Boolean,
      required: true
    },
    permissions: {
      type: Array,
      required: true
    }
  },
  data() {
    const data = [
      {
        id: 1,
        label: "一级 1",
        children: [
          {
            id: 4,
            label: "二级 1-1",
            children: [
              {
                id: 9,
                label: "三级 1-1-1"
              },
              {
                id: 10,
                label: "三级 1-1-2"
              }
            ]
          }
        ]
      },
      {
        id: 2,
        label: "一级 2",
        children: [
          {
            id: 5,
            label: "二级 2-1"
          },
          {
            id: 6,
            label: "二级 2-2"
          }
        ]
      },
      {
        id: 3,
        label: "一级 3",
        children: [
          {
            id: 7,
            label: "二级 3-1"
          },
          {
            id: 8,
            label: "二级 3-2"
          }
        ]
      }
    ];
    return {
      data: JSON.parse(JSON.stringify(data))
    };
  },
  computed: {
    ...mapState(["permissionOps"])
  },

  methods: {
    close(value) {
      this.$emit("update:openEdit", value);
    },
    confirm() {
      const permissions = this.$refs.tree.getCheckedKeys();
      if (permissions.length === 0) {
        this.$message({
          type: "error",
          message: "权限列表不能为空"
        });
      } else {
        this.$emit("setPermissions", this.$refs.tree.getCheckedKeys());
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>