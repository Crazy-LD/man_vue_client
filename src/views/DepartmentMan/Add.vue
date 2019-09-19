<template>
  <el-dialog :title="title" :visible="openAdd" v-el-drag-dialog v-on:update:visible="close($event)">
    <el-form :model="form" :rules="formRules" ref="addForm">
      <el-form-item prop="name" label="部门名称" label-width="120px" required>
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item prop="responsibility" label="部门主要职责" label-width="120px">
        <el-input type="textarea" v-model="form.responsibility"></el-input>
      </el-form-item>
      <el-form-item prop="introduce" label="部门简介" label-width="120px">
        <el-input type="textarea" v-model="form.introduce"></el-input>
      </el-form-item>
      <el-form-item prop="dateOfEstablishment" label="成立时间" label-width="120px" required>
        <DatePicker :value.sync="form.dateOfEstablishment" />
      </el-form-item>
      <el-form-item label="父级部" label-width="120px">
        <el-cascader
          :options="handledPidOpts"
          :props="{ checkStrictly: true, emitPath: false }"
          clearable
          v-model="form.pId"
          :show-all-levels="false"
          placeholder="顶级部门"
        ></el-cascader>
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
import { validInput, validTextarea } from "../../utils/validate";
import { createNamespacedHelpers } from "vuex";
import elDragDialog from "../../directive/el-drag-dialog";
const { mapState } = createNamespacedHelpers("department");
export default {
  directives: {
    elDragDialog
  },
  mounted() {
    // this._updatePidOpts();
    if (this.pIdOptions.length === 0) {
      this.$store.dispatch("department/getDepartOps").catch(() => {
        console.log("获取部门选项失败");
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
    return {
      title: this.isAdd ? "添加部门" : "修改部门",
      requestPath: this.isAdd ? "add" : "update",
      // handledPidOpts: [],
      form: {
        _id: this.rowData._id,
        name: this.rowData.name,
        responsibility: this.rowData.responsibility,
        introduce: this.rowData.introduce,
        dateOfEstablishment: this.rowData.dateOfEstablishment,
        pId: this.rowData.pId ? this.rowData.pId._id : ""
      },
      formRules: {
        name: [
          {
            trigger: "blur",
            validator: validateInput("部门名称")(validInput)
          }
        ],
        responsibility: [
          {
            trigger: "blur",
            validator: validateInput("部门职责")(validTextarea)
          }
        ],
        introduce: [
          {
            trigger: "blur",
            validator: validateInput("部门介绍")(validTextarea)
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      pIdOptions: state => state.departOps
    }),
    handledPidOpts() {
      const tempPidOpts = JSON.parse(JSON.stringify(this.pIdOptions));
      if (this.form._id) {
        this._deepUpdateData(tempPidOpts, false);
        return tempPidOpts;
      } else {
        return this.pIdOptions;
      }
    }
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
            .dispatch("department/" + this.requestPath, this.form)
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
    },
    // _updatePidOpts() {
    //   const tempPidOpts = [...this.pIdOptions];
    //   if (this.form._id) {
    //     this._deepUpdateData(tempPidOpts, false);
    //   }
    //   this.handledPidOpts = tempPidOpts;
    // },
    _deepUpdateData(tempPidOpts, isDisabled) {
      for (const tempPidOpt of tempPidOpts) {
        if (tempPidOpt.value === this.form._id || isDisabled) {
          tempPidOpt.disabled = true;
          if (tempPidOpt.children && tempPidOpt.children.length > 0) {
            this._deepUpdateData(tempPidOpt.children, true);
          }
        } else {
          if (tempPidOpt.children && tempPidOpt.children.length > 0) {
            this._deepUpdateData(tempPidOpt.children, false);
          }
        }
      }
    }
  }
};
</script>