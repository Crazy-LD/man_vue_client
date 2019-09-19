<template>
  <div class="item">
    <SuggestInput
      placeholder="审计主体"
      :inputValue.sync="abcdefg"
      :inputValueOptions="abcdefgOptions"
    />
  </div>
</template>
<script>
import SuggestInput from "../../components/suggest-input/suggest-input";
export default {
  data() {
    return {
      abcdefg: "",
      abcdefgOptions: ["张三", "李四", "王五"]
    };
  },
  components: {
    SuggestInput
  }
};
</script>