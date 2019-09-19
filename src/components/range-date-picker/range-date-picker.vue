<template>
  <el-date-picker
    v-model="value"
    type="datetimerange"
    :picker-options="pickerOptions"
    range-separator="至"
    :start-placeholder="startPlace"
    :end-placeholder="endPlace"
    align="right"
  ></el-date-picker>
</template>

<script>
export default {
  props: {
    startPlace: {
      type: String,
      default: '开始日期'
    },
    endPlace: {
      type: String,
      default: '结束日期'
    },
    start2End: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value: this.$props.start2End
    };
  },
  watch: {
    value(newValue) {
      this.$emit('update:start2End', newValue);
    }
  }
};
</script>