<template>
  <div class="single">
    <base-header :show-arrow="true" />
    <work-block />
  </div>

</template>


<script>
import AboutBlock from "@/components/blocks/AboutBlock";
import WorkBlock from "@/components/blocks/WorkBlock";
import CollectionBlock from "@/components/blocks/CollectionBlock";
import BasePage from "@/components/BasePage";
import pageInstanceState, {pageStateInit} from "@/pageInstance/page-instance.state";
import BaseHeader from "@/components/common/BaseHeader";
import $ from "jquery";

export default {
  name: "SinglePage",
  components: {BaseHeader, BasePage, CollectionBlock, WorkBlock, AboutBlock},
  created() {
    pageStateInit()
  },
  computed: {
    windowWidth() {
      return pageInstanceState.windowWidth
    }
  },
  mounted() {
    // Отмечаем, что страница загружена и откатываем скролл
    pageInstanceState.isLoaded = true;
    $(window).scrollTop(0)
  },
}
</script>
