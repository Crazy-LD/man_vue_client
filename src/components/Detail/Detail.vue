<template>
  <el-dialog title="详情" :visible="openDetail" v-el-drag-dialog v-on:update:visible="close($event)">
    <div>
      <el-row v-for="detail in details" :key="detail.label">
        <el-col :span="6" class="label">{{detail.label}}</el-col>
        <el-col
          :class="detail.value&&detail.value.length > 25 ? 'multiLine':'oneLine'"
          :span="18"
        >{{detail.value}}</el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="close(false)">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import elDragDialog from "../../directive/el-drag-dialog";
export default {
  directives: {
    elDragDialog
  },
  mounted() {},
  props: {
    openDetail: {
      type: Boolean,
      required: true
    },
    details: {
      type: Array,
      required: true
    }
  },
  methods: {
    close(value) {
      this.$emit("update:openDetail", value);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 22px;
  .label {
    line-height: 40px;
    padding-right: 22px;
    text-align: right;
  }
  .oneLine {
    line-height: 40px;
    min-height: 40px;
    padding: 0 15px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  }
  .multiLine {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    padding: 5px 15px;
    min-height: 42px;
  }
}
</style>