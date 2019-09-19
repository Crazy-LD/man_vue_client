<template>
  <el-autocomplete
    class="inline-input"
    v-model="myInputValue"
    :fetch-suggestions="query"
    @input="handleChange"
    :placeholder="placeholder"
  ></el-autocomplete>
</template>

<script>
export default {
  props: {
    inputValue: {
      type: String,
      required: true
    },
    inputValueOptions: {
      type: Array,
      default: () => {
        return [];
      }
    },
    placeholder: {
      type: String,
      default: "请输入值"
    }
  },
  data() {
    return {
      myInputValue: this.$props.inputValue
    };
  },
  methods: {
    query(queryString, cb) {
      const { inputValueOptions } = this;
      let results = [];
      if (queryString !== "") {
        results = inputValueOptions.reduce((preValue, currentValue) => {
          currentValue.indexOf(queryString) > -1 &&
            preValue.push({ value: currentValue });
          return preValue;
        }, []);
      } else {
        results = inputValueOptions.reduce((preValue, currentValue) => {
          preValue.push({ value: currentValue });
          return preValue;
        }, []);
      }
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    handleChange(value) {
      this.$emit("update:inputValue", value);
    }
  }
};
</script>
