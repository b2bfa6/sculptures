<template>
  <div
      ref="about"
      @scroll="onScroll"
      :class="{
        'active': isActiveBlock,
        'lock': lockScroll,
        'home': isHomePage
      }"
      class="about">

    <!-- Содержимое блока -->
    <div class="about__body" :style="{height: contentHeight + 'px'}" >
      <div class="about__block">

        <!-- Изображение -->
        <div :style="image" class="about__image image">
          <router-link to="/about" class="image__item" v-html="aboutPhoto"></router-link>
        </div>

        <!-- Залоговок -->
        <div class="about__title title" v-html="aboutHeading"></div>

        <!-- Цитата -->
        <div class="about__quote" v-html="aboutQuote"></div>

      </div>

      <!-- Текстовый контент -->
      <Transition>

        <div :class="{hidden: fade}" id="about-text" class="about__content" v-html="aboutText">

        </div>
      </Transition>


    </div>
  </div>
</template>

<script>
import pageInstanceState from "@/pageInstance/page-instance.state";


export default {
  name: "AboutBlock",
  mounted() {
    this.contentHeight = this.$refs.about.offsetHeight
  },
  data() {
    return {
      wasScrolled: false,
      lockScroll: false,
      fade: false,
      contentHeight: 0,
      image: {
        top: 'auto',
        transition: 'none'
      }
    }
  },
  computed: {
    activeColumn() {
      return pageInstanceState.activeColumn
    },
    isAboutPage() {
      return this.$route.path === '/about'
    },
    isSinglePage() {
      return this.$route.path.includes('/single')
    },
    isNewsPage() {
      return this.$route.path.includes('/news')
    },
    isGalleryPage() {
      return this.$route.path.includes('/gallery')
    },
    isActiveBlock() {
      return pageInstanceState.activeBlock === 'about' || this.$route.path === '/about'
    },
    isHomePage() {
      return this.$route.path === '/'
    },
    aboutHeading() {
      return pageInstanceState.content['about_heading']
    },
    aboutQuote() {
      return pageInstanceState.content['about_quote']
    },
    aboutText() {
      return pageInstanceState.content['about_text']
    },
    aboutPhoto() {
      return pageInstanceState.content['about_photo']
    },
  },
  methods: {
    onScroll() {
      // Кол-во проскролленных пикселей
      const top = this.$refs.about.scrollTop

      // На странице Single и Gallery делаем скролл картинки (несмотря на то, что она зафиксирована)
      if (this.isSinglePage || this.isGalleryPage || this.isNewsPage) {

        this.image.top = 200 - top + 'px'
        this.image.transition = 'none !important'
      }

      // Прячем бургер шапки, если текст начинает слишком близко приближаться к нему
      if (top > 100 && !document.body.classList.contains('hide-burger')) {
        document.body.classList.add('hide-burger')
      }
      if (top < 100 && document.body.classList.contains('hide-burger')) {
        document.body.classList.remove('hide-burger')
      }


      // Расширяем колонку только на главной странице
      if (!(this.$route.path === '/')) return

      // Если элемент еще не скроллился ни разу
      if (!this.wasScrolled && !this.isActiveBlock) {
        this.$refs.about.scrollTo(0, 0)
      }

      // Если пользователь начинает скроллить блок, то делаем его активным и меняем адрес
      if (!this.isActiveBlock && !pageInstanceState.lock) {
        pageInstanceState.activeBlock = 'about'
        pageInstanceState.lock = true
        pageInstanceState.currentColumnWidth = pageInstanceState.columnWidth.about

        this.$router.push('about')

        this.lockScroll = true
        this.$emit('expand-first-column')
        setTimeout(function () {
          this.lockScroll = false
          this.wasScrolled = true
          pageInstanceState.lock = false
        }.bind(this), 600)


      }
    },
  },
  watch: {
    async '$route'(from, to) {
      // Обнуляем скролл, чтобы картинка не наезжала на текст
      this.$refs.about.scrollTo(0, 0)
      this.image.transition = null
      this.image.top = null

      // Если первый раз зашли на страницу Single, то пропускаем анимацию
      if (from.path.includes('/single') && to.path.includes('/single')) return

      // Анимация для текстового блока
      this.fade = true
      setTimeout(() => {
        this.fade = false
      }, 900)
    }
  }
}
</script>

