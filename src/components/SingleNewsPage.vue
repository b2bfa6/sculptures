<template>
  <div class="single">
    <base-header :show-arrow="true" />
    <mobile-single-news-block />
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
import SingleNewsBlock from "@/components/blocks/SingleNewsBlock";
import MobileSingleNewsBlock from "@/components/blocks/MobileSingleNewsBlock";

export default {
  name: "SingleNewsPage",
  components: {MobileSingleNewsBlock, SingleNewsBlock, BaseHeader, BasePage, CollectionBlock, WorkBlock, AboutBlock},
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
