<template>
  <el-form-item prop="abcdefg" label="成立时间" label-width='120px'>
    <el-cascader
      :options="abcdefgOptions"
      :props="{ checkStrictly: true,expandTrigger: 'hover', emitPath: false }"
      clearable
      v-model="abcdefg"
      :show-all-levels="false"
      placeholder="部门"
    ></el-cascader>
  </el-form-item>
</template>
<script>
export default {
  data() {
    return {
      abcdefg: "",
      abcdefgOptions: [
        {
          value: "技术部",
          label: "技术部",
          children: [
            {
              value: "前端部",
              label: "前端部",
              children: [
                {
                  value: "UI部",
                  label: "UI部",
                  children: [
                    {
                      value: "美工",
                      label: "美工"
                    }
                  ]
                }
              ]
            },
            {
              value: "后端部",
              label: "后端部"
            },
            {
              value: "运营部",
              label: "运营部"
            }
          ]
        },
        {
          value: "人才部",
          label: "人才部"
        },
        {
          value: "后勤部",
          label: "后勤部"
        },
        {
          value: "宣传部",
          label: "后勤部"
        }
      ]
    };
  }
};
</script>