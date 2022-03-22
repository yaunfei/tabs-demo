<template>
  <div>
    <div class="pre-header"></div>
    <coTabs>
      <coTab title="标题1">
        <div style="height: 900px">测试1</div>
      </coTab>
      <coTab title="标题2"> 
        <div style="height: 300px">测试2</div>
      </coTab>
      <coTab title="标题3"> 
        <div style="height: 100px">测试3</div>
      </coTab>
      <coTab title="标题4"> 
        <div style="height: 900px">测试4</div>
      </coTab>
    </coTabs>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import coTabs from "@/components/co-tabs";
import coTab from "@/components/co-tab";
</script>

<style lang="less">
.pre-header {
  height: 300px;
  background-color: skyblue;
}
</style>
