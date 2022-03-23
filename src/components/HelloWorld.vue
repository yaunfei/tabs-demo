<template>
  <div>
    <div class="pre-header"></div>
    <coTabs>
      <coTab title="标题1">
        <div style="height: 500px; padding-top: 20px;">内容内容1</div>
      </coTab>
      <coTab title="标题2"> 
        <div style="height: 700px; padding-top: 20px;">内容内容2</div>
      </coTab>
      <coTab title="标题3"> 
        <div style="height: 900px; padding-top: 20px;">内容内容3</div>
      </coTab>
      <coTab title="标题4"> 
        <div style="height: 100px; padding-top: 20px;">内容内容4</div>
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
  height: 230px;
  background-image: url(https://img.zcool.cn/community/01e0ef5819f4ada84a0d304f84a8da.jpg@1280w_1l_2o_100sh.jpg);
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
