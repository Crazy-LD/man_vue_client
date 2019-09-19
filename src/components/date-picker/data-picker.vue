<template>
  <el-date-picker
    v-model="myValue"
    align="right"
    type="date"
    placeholder="选择日期"
    :picker-options="pickerOptions"
  ></el-date-picker>
</template>

<script>
export default {
  props: {
      value: {
          type: Date,
          default: () => (new Date())
      }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      myValue: this.$props.value
    };
  },
  watch: {
      myValue(newValue) {
        console.log('laile');
          this.$emit('update:value', newValue);
      }
  }
};
</script>