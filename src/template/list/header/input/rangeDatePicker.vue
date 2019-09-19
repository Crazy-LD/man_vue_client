<template>
  <div class="item">
    <RangeDatePicker startPlace="开始审计时间" endPlace="结束审计时间" :start2End.sync="start2End" />
  </div>
</template>
<script>
import RangeDatePicker from "../../components/range-date-picker/range-date-picker";
export default {
    data() {
        return {
            start2End: []
        }
    }
};
</script>