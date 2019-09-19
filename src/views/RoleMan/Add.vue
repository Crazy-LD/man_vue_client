<template>
  <el-dialog :title="title" :visible="openAdd" v-el-drag-dialog v-on:update:visible="close($event)">
    <el-form :model="form" :rules="formRules" ref="addForm">
      <el-form-item prop="code" label="角色编码" label-width="120px" required>
        <el-input v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item prop="name" label="角色名称" label-width="120px" required>
        <el-input v-model="form.name"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { validInput } from "../../utils/validate";
import elDragDialog from "../../directive/el-drag-dialog";
export default {
  directives: {
    elDragDialog
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
      title: this.isAdd ? "添加角色" : "修改角色资料",
      requestPath: this.isAdd ? "add" : "update",
      form: {
        _id: this.rowData._id,
        code: this.rowData.code,
        name: this.rowData.name
      },
      formRules: {
        code: [
          {
            trigger: "blur",
            validator: validateInput("角色编码")(validInput)
          }
        ],
        name: [
          {
            trigger: "blur",
            validator: validateInput("角色名称")(validInput)
          }
        ]
      }
    };
  },
  methods: {
    close(value) {
      this.$emit("update:openAdd", value);
    },
    save() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$store
            .dispatch("role/" + this.requestPath, this.form)
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