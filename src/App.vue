<template>
  <div
      :class="{
        home: isHomePage,
        'single-page': isSinglePage || isNewsSingle,
        'gallery-page': isGalleryPage,
        'about-page': isAboutPage,
        'news-page': isNewsPage
      }"
      class="wrapper">
    <div class="container">
      <div class="page">
        <!-- Отрисовка ПК версии -->
        <template v-if="windowWidth > 991.98">

          <!-- Отрисовка шапки -->
          <base-header />

          <!-- Preloader (фон) -->
          <div class="preloader" :class="{hidden: !isLoading}"></div>

          <!-- Логотип. Он же и анимируется во время начальной загрузки -->
          <router-link
              to="/"
              :class="
                {
                  top: !isLoading,
                  shifted: showOneLine,
                  fixed: fixedLogo,
                  center: isLogoCentered,
                  loading: isLoading
                }"
              class="page__logo logo"
              :style="mainLineStyle">
            <img src="@/assets/images/logo.png" alt="">
          </router-link>

          <!-- Линия (ближе к левой части экрана), которая перемещается при изменении размера контента блоков -->
          <span
              :class="{showed: !isLoading}"
              class="page__line page__line_first"
              :style="mainLineStyle">
          </span>

          <!-- Линия (ближе к правой части экрана), которая перемещается при изменении размера контента блоков -->
          <span
              class="page__line"
              v-if="!showOneLine"
              :class="{done: animationDone}"
              :style="{right: columnWidth[2]}">
          </span>

          <!-- Отрисовка блоков в зависимости от выбранного роута -->
          <base-page></base-page>

        </template>

        <!-- Отрисовка мобильной версии -->
        <template v-else>
          <router-view />
        </template>

      </div>
    </div>

  </div>

</template>
<script>
import pageInstanceState, {aboutTextChangePosition, pageStateInit} from "@/pageInstance/page-instance.state.js"
import GalleryBlock from "@/components/blocks/GalleryBlock";
import AboutBlock from "@/components/blocks/AboutBlock";
import BasePage from "@/components/BasePage";
import BaseHeader from "@/components/common/BaseHeader";
import pageInstanceController from "@/pageInstance/page-instance.controller";


/**
 * @vue-data {Boolean} isLogoCentered - Центрируем ли логотип относительно экрана (только для ПК)
 */
export default {
  name: "App",
  watch: {
    '$route'(to, from) {
      ym(94032966, 'hit', to.fullPath)
      // Добавляется класс на время анимации, после анимации удаляется
      document.body.classList.add('anim')

      setTimeout(() => {
        document.body.classList.remove('anim')
      }, 900)

      /*
      * В зависимости от роута менятся конфигурация колонок
      * */
      if (to.path === '/') {
        pageInstanceState.currentColumnWidth = pageInstanceState.columnWidth.home.slice()
        pageInstanceState.activeColumn = 1
        pageInstanceState.activeBlock = null
      }
      if (to.path.includes('/single')) {
        pageInstanceState.currentColumnWidth = pageInstanceState.columnWidth.single.slice()
        pageInstanceState.activeColumn = 2
        pageInstanceState.activeBlock = 'single'
      }

      if (to.path.includes('/about')) {
        pageInstanceState.currentColumnWidth = pageInstanceState.columnWidth.about.slice()
        pageInstanceState.activeColumn = 1
        pageInstanceState.activeBlock = 'about'
      }

      if (to.path.includes('/gallery')) {
        pageInstanceState.currentColumnWidth = pageInstanceState.columnWidth.gallery.slice()
        pageInstanceState.activeColumn = 2
        pageInstanceState.activeBlock = 'gallery'
      }

      if (to.path.match(/\/news\/\d+/)) {
        pageInstanceState.currentColumnWidth = pageInstanceState.columnWidth.singleNews.slice()
        pageInstanceState.activeColumn = 2
        pageInstanceState.activeBlock = 'single'
      } else if (to.path.includes('/news')) {
        pageInstanceState.currentColumnWidth = pageInstanceState.columnWidth.gallery.slice()
        pageInstanceState.activeColumn = 2
        pageInstanceState.activeBlock = 'news'

      }

      // Очищаем работу после того как пользователь покинул её
      if (from.path.includes('/single')) {
        pageInstanceState.activeWork = []
      }
    }
  },
  data() {
    return {
      isLogoCentered: false,
      isLanguagesVisible: false
    }
  },
  async created() {
    if (GLOBAL_LANG) {
      pageInstanceState.language = GLOBAL_LANG
    }
    await pageInstanceController.getLocalization()

    if (window.location.pathname.includes('/single')) {
      this.isLogoCentered = true
    }
  },
  mounted() {

    pageStateInit()
    // искусственная задержка
    setTimeout(() => {
      pageInstanceState.isLoading = false
      this.isLogoCentered = false

      // Завершение анимации
      setTimeout(() => {
        pageInstanceState.animation.done = true

      }, this.animationDelay)

    }, 1500)


  },
  computed: {
    columnWidth() {
      return pageInstanceState.currentColumnWidth
    },

    activeColumn() {
      return pageInstanceState.activeColumn
    },
    windowWidth() {
      return pageInstanceState.windowWidth
    },
    showOneLine() {
      return pageInstanceState.currentColumnWidth.length === 2
    },
    fixedLogo() {
      return (this.isLoading && pageInstanceState.currentColumnWidth.length === 2)
    },
    isLoading() {
      return pageInstanceState.isLoading
    },
    isHomePage() {
      return this.$route.path === '/'
    },
    isSinglePage() {
      return this.$route.path.includes('/single')
    },
    isNewsPage() {
      return this.$route.path.includes('/news')
    },
    isNewsSingle() {
      return this.$route.path.match(/\/news\/\d+/)
    },
    isAboutPage() {
      return this.$route.path.includes('/about')
    },
    isGalleryPage() {
      return this.$route.path.includes('/gallery')
    },
    animationDone() {
      return pageInstanceState.animation.done
    },
    animationDelay() {
      return pageInstanceState.animation.delay
    },
    mainLineStyle() {
      return {
        left: this.columnWidth[0] !== 'auto' ? this.columnWidth[0] : 'calc(100% - ' + this.columnWidth[1] + ')',
        // right: this.columnWidth[0] === 'auto' ? this.columnWidth[1] : 'auto'
      }
    }
  },
  components: {BaseHeader, BasePage, AboutBlock, GalleryBlock},
}
</script>
