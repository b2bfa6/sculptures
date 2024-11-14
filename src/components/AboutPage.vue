<template>
  <base-header :show-arrow="true" />

  <div class="about-page">

    <div class="about-page__main">
      <about-block />
    </div>

    <router-link to="/" class="about-page__link link" v-html="goToBack"></router-link>

  </div>
</template>

<script>
import AboutBlock from "@/components/blocks/AboutBlock";
import BasePage from "@/components/BasePage";
import CollectionBlock from "@/components/blocks/CollectionBlock";
import BaseHeader from "@/components/common/BaseHeader";
import pageInstanceState, {pageStateInit} from "@/pageInstance/page-instance.state";
import $ from "jquery";

export default {
  name: 'AboutPage',
  components: {BaseHeader, CollectionBlock, BasePage, AboutBlock},
  created() {
    pageStateInit()

  },
  mounted() {
    // Отмечаем, что страница загружена и откатываем скролл
    pageInstanceState.isLoaded = true;
    $(window).scrollTop(0)
  },
  computed: {
    windowWidth() {
      return pageInstanceState.windowWidth
    },
    goToBack() {
      return pageInstanceState.content['go_to_back']
    }
  }
}
</script>
