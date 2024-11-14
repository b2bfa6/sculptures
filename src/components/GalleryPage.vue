<template>
  <base-header :is-languages-invisible="true" />
  <base-languages />
  <div class="gallery">
    <div class="gallery__dropdown dropdown-gallery" :class="{'active': isDropdownActive}">
      <div @click="isDropdownActive = !isDropdownActive" class="dropdown-gallery__head">
        <span v-html="activeSection"></span>
        <img src="@/assets/images/icons/angle-down.svg" alt="">
      </div>
      <ul class="dropdown-gallery__list">
        <li v-if="languageCode === 'ru'" @click="getWorks" :class="{'hidden': activeSection === 'Все работы'}" class="dropdown-gallery__item">Все работы</li>
        <li v-if="languageCode === 'en'" @click="getWorks" :class="{'hidden': activeSection === 'All works'}" class="dropdown-gallery__item">All works</li>
        <li @click="updateWorks(section.id, section.description, section.name)" v-for="(section, index) in sections" :class="{'hidden': activeSection === section.name}" class="dropdown-gallery__item">{{section.name}}</li>
      </ul>
    </div>


    <div v-if="description" v-html="description" class="gallery__description"></div>
    <!-- Первая колонка с работами -->
    <div class="gallery__column">
      <gallery-block :page="1" />
    </div>

    <!-- Декоративная линия по центру -->
    <div class="gallery__line"></div>

    <!-- Логотип -->
    <router-link to="/" class="gallery__logo">
      <img src="@/assets/images/logo.svg" alt="">
    </router-link>

    <!-- Вторая колонка с работами -->
    <div class="gallery__column">
      <gallery-block :page="2" />
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
export default {
  name: "gallery-page",
  components: {BaseLanguages, BaseHeader, GalleryBlock},
  methods: {
    async getWorks() {
      this.isDropdownActive = !this.isDropdownActive
      if (this.languageCode === 'ru') {
        pageInstanceState.activeSection = "Все работы"
        pageInstanceState.activeWorkDescription = ''
      } else if (this.languageCode === 'en') {
        pageInstanceState.activeSection = "All works"
        pageInstanceState.activeWorkDescription = ''
      }

      await pageController.getWorks()

      pageInstanceState.activeWorkDescription = ""
    },
    async updateWorks(id, description, name) {
      this.isDropdownActive = !this.isDropdownActive

      await pageController.updateWorks(id)

      pageInstanceState.activeWorkDescription = description
      pageInstanceState.activeSection = name
    },
  },
  data() {
    return {
      isDropdownActive: false
    }
  },
  created() {
    pageStateInit()
  },
  computed: {
    windowWidth() {
      return pageInstanceState.windowWidth
    },
    description() {
      return pageInstanceState.activeWorkDescription
    },
    activeSection() {
      return pageInstanceState.activeSection
    },
    sections() {
      return pageInstanceState.sections

    },
    languageCode() {
      return pageInstanceState.language
    },
    totalToggler() {
      return pageInstanceState.totalToggler
    },
  },
  async mounted() {
    // Отмечаем, что страница загружена и откатываем скролл
    pageInstanceState.isLoaded = true;
    $(window).scrollTop(0)

    await pageController.getSections()

    if (pageInstanceState.sections.length > 0) {
      pageInstanceState.activeWorkDescription = ""

      if (this.languageCode === 'ru') {
        pageInstanceState.activeSection = "Все работы"
      } else if (this.languageCode === 'en') {
        pageInstanceState.activeSection = "All works"
      }

    }
  },

}
</script>
