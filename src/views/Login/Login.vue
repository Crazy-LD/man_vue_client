<template>
  <section class="container">
    <div class="main">
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        :hide-required-asterisk="true"
      >
        <h3>后台管理系统</h3>
        <el-form-item prop="username" style="position:relative">
          <el-input v-model="loginForm.username" @keyup.enter.native="login">
            <span class="svg-container" slot="prefix">
              <icon-svg icon-class="mail" />
            </span>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="loginForm.password" :show-password="true" type="password">
            <span class="svg-container" slot="prefix">
              <icon-svg icon-class="lock1" />
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input v-model="loginForm.captcha" @keyup.enter.native="login">
            <span slot="suffix">
              <img
                :src="captchaUrl"
                style="height:40px"
                alt="验证码"
                ref="captcha"
                @click="getCaptcha"
              />
            </span>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col>
            <el-button :loading="loading" type="primary" style="width:100%" @click="login">登录</el-button>
          </el-col>
          <el-col :span="4" :push="20" style="margin-top: 10px;">
            <router-link to="/register" replace>
              <el-link type="primary">去注册</el-link>
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
import config from "../../../config";
export default {
  mounted() {
    this.getCaptcha();
  },
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
    return {
      loading: false,
      loginForm: {
        username: "",
        password: "",
        captcha: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        captcha: [{ required: true, trigger: "blur" }]
      },
      BASE_URL:
        process.env.NODE_ENV === "production"
          ? config.build.BASE_URL
          : config.dev.BASE_URL
    };
  },
  computed: {
    captchaUrl() {
      const BASE_URL =
        process.env.NODE_ENV === "production"
          ? config.build.BASE_URL
          : config.dev.BASE_URL;
      return BASE_URL + "/user/getcaptcha?time=" + Date.now();
    }
  },
  methods: {
    login() {
      this.loading = true;
      this.$store
        .dispatch("user/login", this.loginForm)
        .then(() => {
          this.$router.push({ path: "/" });
          this.loading = false;
        })
        .catch(() => {
          this.getCaptcha();
          this.loginForm.captcha = "";
          this.loading = false;
        });
      // this.$refs.loginForm.validate(valid => {
      //   if (valid) {
      //     this.loading = true;
      //     this.$store
      //       .dispatch("user/login", this.loginForm)
      //       .then(() => {
      //         this.$router.push({ path: "/" });
      //         this.loading = false;
      //       })
      //       .catch(() => {
      //         this.getCaptcha();
      //         this.loginForm.captcha = "";
      //         this.loading = false;
      //       });
      //   } else {
      //     this.$message({
      //       showClose: true,
      //       message: "请完善登录信息",
      //       type: "error"
      //     });
      //   }
      // });
    },
    getCaptcha() {
      this.$refs.captcha.src = this.captchaUrl;
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