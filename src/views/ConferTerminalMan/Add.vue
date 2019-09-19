<template>
  <el-dialog :title="title" :visible="openAdd" v-el-drag-dialog v-on:update:visible="close($event)">
    <el-form :model="form" :rules="formRules" ref="addForm">
      <el-form-item prop="code" label="终端编码" label-width="120px" required>
        <el-input v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item prop="name" label="终端名称" label-width="120px" required>
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item prop="ip" label="IP地址" label-width="120px">
        <el-input v-model="form.ip"></el-input>
      </el-form-item>
      <el-form-item prop="classifiedGrade" label="密级" label-width="120px">
        <el-select v-model="form.classifiedGrade" placeholder="密级" required>
          <el-option
            v-for="(classifiedGradeD, index) in classifiedGradeDic"
            :key="index"
            :label="classifiedGradeD"
            :value="index"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { validInput, validIP } from "../../utils/validate";
import elDragDialog from "../../directive/el-drag-dialog";
import { classifiedGradeDic } from "../../utils/dictionary";
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

    const validateIP = (rule, value, callback) => {
      console.log(value);
      if (!validIP(value)) {
        callback(new Error("IP地址的格式不正确,示例:127.0.0.1"));
      } else {
        callback();
      }
    };
    return {
      title: this.isAdd ? "新增会议室终端" : "修改会议室终端",
      requestPath: this.isAdd ? "add" : "update",
      form: {
        _id: this.rowData._id,
        code: this.rowData.code,
        name: this.rowData.name,
        ip: this.rowData.ip,
        classifiedGrade: this.rowData.classifiedGrade
      },
      formRules: {
        code: [
          {
            trigger: "blur",
            validator: validateInput("会议室终端编码")(validInput)
          }
        ],
        name: [
          {
            trigger: "blur",
            validator: validateInput("会议室终端名称")(validInput)
          }
        ],
        ip: [
          {
            trigger: "blur",
            validator: validateIP
          }
        ]
      }
    };
  },
  computed: {
    classifiedGradeDic() {
      const result = [];
      Object.keys(classifiedGradeDic).forEach(key => {
        result.push(classifiedGradeDic[key]);
      });
      return result;
    }
  },

  methods: {
    close(value) {
      this.$emit("update:openAdd", value);
    },
    save() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$store
            .dispatch("conferTerminal/" + this.requestPath, this.form)
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