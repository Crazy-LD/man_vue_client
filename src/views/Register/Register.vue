<template>
  <section class="container">
    <div class="main">
      <el-form
        :model="registerForm"
        :rules="loginRules"
        ref="registerForm"
        :hide-required-asterisk="true"
        class="registerForm"
      >
        <h3>后台管理系统</h3>
        <el-form-item prop="username" style="position:relative">
          <el-input v-model="registerForm.username">
            <span class="svg-container" slot="prefix">
              <icon-svg icon-class="mail" />
            </span>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="registerForm.password" :show-password="true" type="password">
            <span class="svg-container" slot="prefix">
              <icon-svg icon-class="lock1" />
            </span>
          </el-input>
        </el-form-item>

        <el-form-item prop="password2">
          <el-input
            v-model="registerForm.password2"
            :show-password="true"
            type="password"
            @keyup.enter.native="register"
          >
            <span class="svg-container" slot="prefix">
              <icon-svg icon-class="lock1" />
            </span>
          </el-input>
        </el-form-item>

        <el-row>
          <el-col>
            <el-button :loading="loading" type="primary" style="width:100%" @click="register">注册</el-button>
          </el-col>
          <el-col :span="4" :push="20" style="margin-top: 10px;">
            <router-link to="/login" replace>
              <el-link type="primary">去登录</el-link>
            </router-link>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </section>
</template>

<script>
import iconSvg from "../../components/Icon-svg/icon-svg";
import { validUsername, validPassword } from "../../utils/validate";
export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("长度在 4 到 9 个字符"));
      } else {
        callback();
      }
    };

    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error("长度在 4 到 9 个字符"));
      } else {
        callback();
      }
    };
    const validatePassword2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      registerForm: {
        username: "",
        password: "",
        password2: ""
      },
      loginRules: {
        username: [
          { required: true, validator: validateUsername, trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: "blur" }
        ],
        password2: [
          { required: true, validator: validatePassword2, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    register() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const data = { ...this.registerForm };
          delete data.password2;
          this.$store
            .dispatch("user/register", this.registerForm)
            .then(() => {
              this.$router.push({ path: "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.$message({
            showClose: true,
            message: "请完善注册信息",
            type: "error"
          });
        }
      });
    }
  },
  components: {
    "icon-svg": iconSvg
  }
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  background: #f5f6fa;
}
.main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 460px;
  padding: 50px;
  box-sizing: border-box;
  background: white;
}
.svg-container {
  padding-left: 6px;
  color: #889aa4;
  width: 30px;
}
h3 {
  text-align: center;
  color: #aaaaaa;
  font-size: 26px;
}
</style>