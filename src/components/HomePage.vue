<template>

  <base-header :is-languages-invisible="true" v-if="wasPageScrolled" ref="header" />
  <div class="home">
    <base-languages :was-page-scrolled="wasPageScrolled" :is-absolute="true" />
    <!-- Главный загрузочный экран  -->
      <div
          :style="{
            height: !wasPageScrolled ? '100vh' : 'auto'
          }"
          :class="{scrolled: wasPageScrolled}"
          class="home__main main-home"
          ref="mainScreen">
        <!-- Логотип  -->
        <div
            :class="{hidden: isHiddenTop, fixed: isLogoFixed}"
            class="main-home__logo">
          <svg
              :style="{
                width: logo.width,
                height: logo.height,
                top: logo.top + '%'
              }">
            <use xlink:href="@/assets/images/logo.svg#logo"></use>
          </svg>
        </div>
      </div>
      <!-- Линия  -->
      <div class="line"></div>

    <!-- Блок Галерея  -->
      <div ref="gallery" class="gallery" :class="{hidden: isHiddenTop}">
        <div class="gallery__column">
          <gallery-block  :page="1" orientation="vertical" />
        </div>
        <div class="gallery__column">
          <gallery-block :page="2" orientation="horizontal" />
        </div>
      </div>
    <!-- Блок О нас  -->
      <div ref="about" class="home__about">
        <about-block />
      </div>
  </div>
</template>

<script>
import GalleryBlock from "@/components/blocks/GalleryBlock";
import AboutBlock from "@/components/blocks/AboutBlock";
import BasePage from "@/components/BasePage";
import pageInstanceState from "@/pageInstance/page-instance.state";
import {pageStateInit} from "@/pageInstance/page-instance.state";
import BaseHeader from "@/components/common/BaseHeader";
import $ from 'jquery'
import BaseLanguages from "@/components/common/BaseLanguages";

export default {
  name: 'HomePage',
  data() {
    return {
      wasMainBlockScrolled: false,
      isHiddenTop: false,
      wasPageScrolled: false,
      isLogoFixed: false,
      logo: {
        top: 50,
        height: 360,
        width: 160,
      }
    }
  },
  created() {
    $(window).scrollTop(0)
  },
  mounted() {
    // Если начинаем доскролливать до блока about, то скрываем предыдущие блоки
    window.addEventListener('scroll', () => {
      const aboutBlockTopPos = this.$refs.about.getBoundingClientRect().top

      if (aboutBlockTopPos - 150 <= 0 && !this.isHiddenTop) {
        this.isHiddenTop = true

      } else if (aboutBlockTopPos - 150 >= 0 && this.isHiddenTop) {
        this.isHiddenTop = false
      }
    })

    // Если сайт уже был загружен, то не начинаем загрузку с нуля
    if (this.isLoaded) {
      this.isLogoFixed = true
      this.wasPageScrolled = true

      return
    }

    // Начинаем загрузку

    document.body.style.overflow = 'hidden'

    const initialTopValue = this.logo.top
    const finalLogoWidth = 43
    const finalLogoHeight = 90

    pageStateInit()

    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })
    .then(() => {
          $('html, body').animate({
            scrollTop: this.$refs.mainScreen.clientHeight
          }, 900, null)
    })
    .then(() => {
      setTimeout(() => {
        document.body.style.overflow = 'auto'
        this.wasPageScrolled = true
        $(window).scrollTop(0, 0)
      }, 1100)
    })

    // Чтобы не было багов, перед возможной перезагрузки страницы откатываем ее на начальное положение
    window.onbeforeunload = function () {
      $(window).scrollTop(0);
    }
    window.addEventListener('scroll', () => {
      // Получаем высоту окна главного экрана, по сути - высоту окна браузера
      const mainScreenHeight  = this.$refs.mainScreen.offsetHeight

      // Кол-во проскролленных пикселей
      const scrollTop = document.documentElement.scrollTop

      // Какой процент от всего окна уже был прокручен (число с плавающей точной)
      const offset = scrollTop / mainScreenHeight

      // Преобразуем переменную offset. В данном случае 4 - во сколько раз нужно уменьшить логотип
      const percent = ((1 - offset) * 4).toFixed(2)

      if (percent < 1) return
      this.logo.height = percent * finalLogoHeight
      this.logo.width = percent * finalLogoWidth

      this.logo.top = ((1 - offset) * initialTopValue).toFixed(2)
    })



  },
  computed: {
    windowWidth() {
      return pageInstanceState.windowWidth
    },
    isLoaded() {
      return pageInstanceState.isLoaded
    }
  },
  components: {BaseLanguages, BaseHeader, BasePage, AboutBlock, GalleryBlock},
}
</script>
