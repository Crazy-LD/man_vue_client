<template>
  <el-dialog title="增加信息" :visible="openAdd" v-on:update:visible="close($event)">
    <el-form :model="form" :rules="formRules" ref="addForm">
      <el-form-item prop="abcdefg" label="审计主体" label-width="120px">
        <el-input v-model="form.abcdefg"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>
  
</template>

<script>
import { validInput, validTextarea } from "../../utils/validate";
export default {
  props: {
    openAdd: Boolean
  },
  data() {
    return {
      form: {
        abcdefg: ""
      },
      formRules: {
        abcdefg: [
          {
            trigger: "blur",
            validator: validateInput("部门名称")(validInput)
          }
        ]
      }
    };
  },
  methods: {
    close(value) {
      this.$emit("update:openAdd", value);
    }
  }
};
</script>

<style>
</style>