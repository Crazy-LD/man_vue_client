<template>
  <el-container style="height: 100%; width: 100%;">
    <el-aside width="auto">
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        :collapse="isCollapse"
        :unique-opened="true"
        :router="true"
      >
        <h3 style="text-align: center; color: #D2D2D2;">{{isCollapse ? '' : title}}</h3>
        <template v-for="route in routes">
          <template v-if="!route.hidden">
            <el-submenu
              :index="route.title"
              v-if="route.children&&!route.noDropMenu"
              :key="route.title"
            >
              <template slot="title">
                <i :class="route.icon"></i>
                <span slot="title">{{route.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  :index="route.path + '/' + child.path"
                  v-for="child in route.children"
                  :key="child.title"
                >{{child.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-menu-item :index="route.path" v-else :key="route.title">
              <i :class="route.icon"></i>
              <span slot="title">{{route.title}}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </el-aside>

    <el-container style="margin-left:5px;">
      <el-header>
        <div class="control" @click="changeIsCollapse">
          <i
            class="el-icon-s-operation"
            style="transition: transform .5s;"
            :class="isCollapse ? 'rotated' : 'rotate'"
          ></i>
        </div>
        <div>
          <el-dropdown>
            <div class="avatar">
              <el-avatar :size="50" src="avatar.png"></el-avatar>
              <span style="margin-left: 15px;">{{name || username}}</span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <div>
                <el-dropdown-item icon="el-icon-user">个人信息</el-dropdown-item>
              </div>
              <div @click="$router.push('/reset')">
                <el-dropdown-item icon="el-icon-edit">修改密码</el-dropdown-item>
              </div>
              <div @click="logout">
                <el-dropdown-item icon="el-icon-right">退出登录</el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main style="padding: 10px;">
        <div style="width: 100%; height:100%;background: white;">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("permission");
const { mapState: userMapState } = createNamespacedHelpers("user");
const { mapState: appMapState } = createNamespacedHelpers("app");
export default {
  data() {
    return {
      title: "后台管理系统"
    };
  },
  computed: {
    ...mapState(["routes"]),
    ...userMapState(["name", "username"]),
    ...appMapState(["isCollapse"]),
    activeMenu() {
      const { path } = this.$route;
      const resultPath = path.replace(/\/index/, "");
      return resultPath;
    }
  },
  methods: {
    logout() {
      this.$confirm("确定要离开吗?", "提示", {
        confirmButtonText: "狠心离开",
        cancelButtonText: "手滑了一下",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$store
            .dispatch("user/logout")
            .then(() => {
              this.$message({
                type: "sucess",
                message: "成功退出",
                duration: 5 * 1000
              });
              this.$router.push("/login");
            })
            .catch(e => {
              console.log(e);
              this.$message({
                type: "errer",
                message: "退出失败, 请检查环境",
                duration: 5 * 1000
              });
            });
        })
        .catch(e => {
          console.log(e);
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    changeIsCollapse() {
      // console.log(this.isCollapse);
      this.$store.commit("app/SET_ISCOLLAPSE", !this.isCollapse);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-header {
  background-color: white;
  color: #333;
  line-height: 60px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
}
.el-container {
  background: #f5f6fa;
}
.el-aside {
  color: #333;
}
.el-menu-vertical {
  height: 100%;
  &:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
}
// .el-menu-vertical:not(.el-menu--collapse) {
// }
.avatar {
  display: flex;
  align-content: center;
  padding-top: 5px;
}
.control {
  font-size: 25px;
  color: gray;
}
.rotated {
  transform: rotate(90deg);
}
.rotate {
  transform: rotate(0deg);
}
</style>
