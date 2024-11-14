<template>
  <base-header :is-languages-invisible="true" />
  <base-languages />
  <div class="gallery">
    <div class="gallery__dropdown dropdown-gallery" :class="{'active': isDropdownActive}">
      <div @click="isDropdownActive = !isDropdownActive" class="dropdown-gallery__head">
        <span v-html="activeNewsSection.name"></span>
        <img src="@/assets/images/icons/angle-down.svg" alt="">
      </div>
      <ul class="dropdown-gallery__list">
        <li @click="updateNews(section.id, section.description, section)" v-for="(section, index) in newsSections" :class="{'hidden': activeNewsSection === section.name}" class="dropdown-gallery__item">{{section.name}}</li>
      </ul>
    </div>


<!--    <div v-if="description" v-html="description" class="gallery__description"></div>-->
    <!-- Первая колонка с работами -->
    <div class="gallery__column" ref="news">
      <news-block :is-first="true" :page="1" />
    </div>

    <!-- Декоративная линия по центру -->
    <div class="gallery__line"></div>

    <!-- Логотип -->
    <router-link to="/" class="gallery__logo">
      <img src="@/assets/images/logo.svg" alt="">
    </router-link>

    <!-- Вторая колонка с работами -->
    <div class="gallery__column" ref="news2">
      <news-block :is-second="true" :page="2" />
    </div>
  </div>

</template>

<script>
import pageInstanceState, {pageStateInit} from "@/pageInstance/page-instance.state";
import GalleryBlock from "@/components/blocks/GalleryBlock";
import BaseHeader from "@/components/common/BaseHeader";
import $ from 'jquery'
import BaseLanguages from "@/components/common/BaseLanguages";
import pageController from "@/pageInstance/page-instance.controller";
import NewsBlock from "@/components/blocks/NewsBlock";
import {debounce} from "@/helpers";
export default {
  name: "gallery-page",
  components: {NewsBlock, BaseLanguages, BaseHeader, GalleryBlock},
  methods: {
    async getWorks() {
      this.isDropdownActive = !this.isDropdownActive


      await pageController.getWorks()

      pageInstanceState.activeWorkDescription = ""
    },
    async updateNews(id, description, section) {
      this.isDropdownActive = !this.isDropdownActive

      // await pageController.updateNews(id)

      pageInstanceState.activeNewsDescription = description
      pageInstanceState.activeNewsSection = section

      pageInstanceState.isLoadingNews = false

      pageInstanceState.currentNewsPage = 1

      pageInstanceState.firstNewsColumn = []
      pageInstanceState.secondNewsColumn = []

      pageInstanceState.firstNewsColumn = await pageController.getNews(pageInstanceState.currentNewsPage)
      pageInstanceState.currentNewsPage += 1
      pageInstanceState.secondNewsColumn = await pageController.getNews(pageInstanceState.currentNewsPage)
    },

  },
  data() {
    return {
      isDropdownActive: false,
      isLoadingNews: false,
      isLoadingNews2: false,
      hasMoreNews: true,
    }
  },
  async created() {
    pageStateInit()






    window.addEventListener('scroll', debounce(async () => {
      if (!this.hasMoreNews) return

      const PADDING = Math.min(
          250,
          this.windowWidth
      );

      // высота всей секции
      const scrollHeight = Math.max(
          this.$refs.news.scrollHeight,
          this.$refs.news.offsetHeight,
          this.$refs.news.clientHeight,
      );

      const scrollTop = -this.$refs.news.getBoundingClientRect().top

      if(scrollTop + PADDING < scrollHeight - innerHeight) return

      try {
        this.isLoadingNews = true

        pageInstanceState.currentNewsPage += 1
        const secondResult = await pageController.getNews(pageInstanceState.currentNewsPage)

        pageInstanceState.secondNewsColumn = [...pageInstanceState.secondNewsColumn, ...secondResult]

        pageInstanceState.currentNewsPage += 1
        const firstResult = await pageController.getNews(pageInstanceState.currentNewsPage)
        pageInstanceState.firstNewsColumn = [...pageInstanceState.firstNewsColumn, ...firstResult]

        this.isLoadingNews = false

        if (!firstResult?.length) {
          pageInstanceState.currentNewsPage -= 1
          this.hasMoreNews = false
        }
        if (!secondResult?.length) {
          pageInstanceState.currentNewsPage -= 1
          this.hasMoreNews = false
        }
      } catch(e) {

        this.isLoadingNews = false
      }
    }, 20))
  },
  computed: {
    windowWidth() {
      return pageInstanceState.windowWidth
    },
    description() {
      return pageInstanceState.activeWorkDescription
    },
    activeNewsSection() {
      return pageInstanceState.activeNewsSection
    },
    newsSections() {
      return pageInstanceState.newsSections

    },
    languageCode() {
      return pageInstanceState.language
    },
    totalToggler() {
      return pageInstanceState.totalToggler
    },
    maxNewsScrollTop() {
      return pageInstanceState.maxNewsScrollTop
    }

  },
  async mounted() {
    // Отмечаем, что страница загружена и откатываем скролл
    pageInstanceState.isLoaded = true;
    $(window).scrollTop(0)

    await pageController.getNewsSections()
  },

}
</script>
