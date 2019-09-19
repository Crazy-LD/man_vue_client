<template>
  <section class="container">
    <div class="main">
      <el-form
        :model="resetForm"
        :rules="resetRules"
        ref="resetForm"
        :hide-required-asterisk="true"
        class="resetForm"
      >
        <h3>后台管理系统</h3>

        <el-form-item prop="oldPassword">
          <el-input
            v-model="resetForm.oldPassword"
            :show-password="true"
            type="password"
            placeholder="密码"
          >
            <span class="svg-container" slot="prefix">
              <icon-svg icon-class="lock1" />
            </span>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="resetForm.password"
            :show-password="true"
            placeholder="新密码"
            type="password"
          >
            <span class="svg-container" slot="prefix">
              <icon-svg icon-class="lock1" />
            </span>
          </el-input>
        </el-form-item>

        <el-form-item prop="password2">
          <el-input
            v-model="resetForm.password2"
            :show-password="true"
            type="password"
            placeholder="确认密码"
            @keyup.enter.native="reset"
          >
            <span class="svg-container" slot="prefix">
              <icon-svg icon-class="lock1" />
            </span>
          </el-input>
        </el-form-item>

        <el-row>
          <el-col>
            <el-button :loading="loading" type="primary" style="width:100%" @click="reset">重置密码</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </section>
</template>

<script>
import iconSvg from "../../components/Icon-svg/icon-svg";
import { validPassword } from "../../utils/validate";
export default {
  data() {
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
      } else if (value !== this.resetForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      resetForm: {
        oldPassword: "",
        password: "",
        password2: ""
      },
      resetRules: {
        oldPassword: [
          { required: true, validator: validatePassword, trigger: "blur" }
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
    reset() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const data = { ...this.resetForm };
          delete data.password2;
          this.$store
            .dispatch("user/reset", this.resetForm)
            .then(() => {
              this.$message({
                type: "success",
                message: "重置密码成功，请重新登录",
                duration: 5 * 1000
              });
              this.loading = false;
              this.$router.push("/login");
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