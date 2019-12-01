<template>
  <el-dialog :title="title" :visible="openAdd" v-el-drag-dialog v-on:update:visible="close($event)">
    <el-form :model="form" :rules="formRules" ref="addForm">
      <el-form-item prop="username" label="用户账号" label-width="120px" required>
        <el-input v-model="form.username" :disabled="isAdd ? false : true"></el-input>
      </el-form-item>
      <el-form-item v-if="isAdd" prop="password" label="用户密码" label-width="120px" required>
        <el-input type="password" :show-password="true" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item prop="name" label="用户姓名" label-width="120px" required>
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item prop="sex" label="性别" label-width="120px">
        <el-select v-model="form.sex" placeholder="性别" required>
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="phone" label="电话号码" label-width="120px">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item prop="email" label="Email" label-width="120px">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item prop="entryTime" label="入职时间" label-width="120px" required>
        <DatePicker :value.sync="form.entryTime" />
      </el-form-item>
      <el-form-item prop="departmentId" label="部门" label-width="120px">
        <el-cascader
          :options="DepartIdOptions"
          :props="{ checkStrictly: true, emitPath: false }"
          clearable
          v-model="form.departmentId"
          :show-all-levels="false"
          placeholder="请选择部门"
        ></el-cascader>
      </el-form-item>
      <el-form-item prop="positionId" label="职位" label-width="120px">
        <el-select v-model="form.positionId" placeholder="职位" required>
          <el-option
            v-for="positionOpt in positionOptions"
            :key="positionOpt.value"
            :label="positionOpt.label"
            :value="positionOpt.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="roleIds" label="用户角色" label-width="120px">
        <el-checkbox-group v-model="form.roleIds">
          <el-checkbox
            v-for="role in roles"
            :key="role._id"
            :label="role._id"
            name="roleIds"
          >{{role.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import DatePicker from "../../components/date-picker/data-picker";
import { validInput, validEmail } from "../../utils/validate";
import { createNamespacedHelpers } from "vuex";
import elDragDialog from "../../directive/el-drag-dialog";
const { mapState: departmentMapState } = createNamespacedHelpers("department");
const { mapState: positionMapState } = createNamespacedHelpers("position");
const { mapState: roleMapState } = createNamespacedHelpers("role");
export default {
  directives: {
    elDragDialog
  },
  mounted() {
    if (this.DepartIdOptions.length === 0) {
      this.$store.dispatch("department/getDepartOps").catch(() => {
        console.log("获取部门选项失败");
      });
    }
    if (this.positionOptions.length === 0) {
      this.$store.dispatch("position/find").catch(() => {
        console.log("获取职位选项失败");
      });
    }
    if (this.roles.length === 0) {
      this.$store.dispatch("role/find").catch(() => {
        console.log("获取角色选项失败");
      });
    }
  },
  props: {
    openAdd: Boolean,
    isAdd: Boolean,
    rowData: Object
  },
  data() {
    const validateInput = tipName => validateFun => (rule, value, callback) => {
      if (!validateFun(value)) {
        callback(new Error(`${tipName}的长度大于${validInput.max}个字符`));
      } else {
        callback();
      }
    };

    const validatePhone = (rule, value, callback) => {
      if (!/^1\d{10}$/.test(value) && value) {
        callback(new Error("手机的格式不正确"));
      } else {
        callback();
      }
    };

    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value) && value) {
        callback(new Error("邮箱的格式不正确"));
      } else {
        callback();
      }
    };

    const validateArrayhasValue = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error("至少分配一个角色"));
      } else {
        callback();
      }
    };

    return {
      title: this.isAdd ? "添加用户" : "修改用户资料",
      requestPath: this.isAdd ? "add" : "update",
      form: {
        _id: this.rowData._id,
        username: this.rowData.username,
        password: this.rowData.password,
        name: this.rowData.name,
        sex: this.rowData.sex || "男",
        phone: this.rowData.phone,
        email: this.rowData.email,
        entryTime: this.rowData.entryTime,
        departmentId: this.rowData.departmentId
          ? this.rowData.departmentId._id
          : "",
        positionId: this.rowData.positionId ? this.rowData.positionId._id : "",
        roleIds: this.rowData.roleIds || []
      },
      formRules: {
        username: [
          {
            trigger: "blur",
            validator: validateInput("用户账号")(validInput)
          }
        ],
        password: [
          {
            trigger: "blur",
            validator: validateInput("用户密码")(validInput)
          }
        ],
        name: [
          {
            trigger: "blur",
            validator: validateInput("姓名")(validInput)
          }
        ],
        phone: [
          {
            trigger: "blur",
            validator: validatePhone
          }
        ],
        email: [
          {
            trigger: "blur",
            validator: validateEmail
          }
        ],
        roleIds: [
          {
            trigger: "blur",
            validator: validateArrayhasValue
          }
        ]
      }
    };
  },
  computed: {
    ...departmentMapState({
      DepartIdOptions: state => state.departOps
    }),
    ...positionMapState({
      positions: state => state.positions
    }),
    positionOptions() {
      const result = this.positions.reduce((preArray, curItem) => {
        preArray.push({ value: curItem._id, label: curItem.name });
        return preArray;
      }, []);
      return result;
    },
    ...roleMapState({
      roles: state => state.roles
    })
  },
  components: {
    DatePicker
  },
  methods: {
    close(value) {
      this.$emit("update:openAdd", value);
    },
    save() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$store
            .dispatch("user/" + this.requestPath, this.form)
            .then(() => {
              this.$message({
                type: "success",
                message: this.title + "成功"
              });
              this.close(false);
            })
            .catch(e => {
              console.log("失败", e);
            });
        } else {
          this.$message({
            type: "error",
            message: "请完善信息"
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button:hover {
    -webkit-appearance: none !important;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
}
</style>