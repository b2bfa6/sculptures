<template>
  <div ref="single" class="single">

    <div class="single__body">
      <!-- Изображения -->
      <div class="single__images">
        <router-link to="/news" class="single__button">
          <img src="@/assets/images/icons/arrow-prev.svg" alt="">
          <span v-if="language === 'ru'">Новости</span>
          <span v-if="language === 'en'">News</span>
        </router-link>
        <div v-if="hasGallery" v-for="(image, index) in newsItem.images" class="single__image">
          <el-image
              :style="{
                'max-width': '100%',
                paddingBottom: ((image.height ? image.height : 70) / (image.width ? image.width : 100)) * 100 + '%'
              }"

              :src="image.src"
              :preview-src-list="srcList"
              :initial-index="initialIndex"
              fit="cover"
              @click="onImageClick(index)"
              @close="onImageClose"
              lazy
          >
          </el-image>
        </div>

        <div v-if="!hasGallery && newsItem.main_image" class="single__image">
          <el-image

              :style="{
                'max-width': '100%',
                paddingBottom: ((newsItem.main_image.height ? newsItem.main_image.height : 70) / (newsItem.main_image.width ? newsItem.main_image.width : 100)) * 100 + '%'
              }"
              :src="newsItem.main_image.src"
              fit="cover"
              lazy
          />
        </div>
      </div>

      <!-- Текстовый контент -->
      <div class="single__content">
        <div class="single__date date" v-html="newsItem.date"></div>
        <!-- Заголовок -->
        <div class="single__title title" :class="{hidden: fade}"  v-html="newsItem.name"></div>
        <!-- Описание -->
        <div class="single__text" :class="{hidden: fade}" v-html="newsItem.description"></div>

      </div>
    </div>
  </div>
</template>

<script>
import pageInstanceState from "@/pageInstance/page-instance.state";
import 'element-plus/dist/index.css'
import icon from "@/assets/images/icons/arrow-prev.svg";
import pageInstanceController from "@/pageInstance/page-instance.controller";
import pageController from "@/pageInstance/page-instance.controller";

export default {
  name: "single-news-block",
  data() {
    return {
      wasScrolled: false,
      lockScroll: false,
      fade: false,
      initialIndex: 0
    }
  },
  async created() {

    pageInstanceState.newsItem = await pageInstanceController.getNewsItem(this.$route.params.id)
    pageInstanceState.currentNewsSection = this.newsItem.section_id
    // pageInstanceState.currentNewsPage = 1
  },
  methods: {

    onImageClick(index) {
      this.initialIndex = index
      document.body.classList.add('hide-all')

      // Замена стандартных переключателей галереи
      setTimeout(() => {
        const arrowPrev = document.querySelector('.el-image-viewer__btn.el-image-viewer__prev')
        const arrowNext = document.querySelector('.el-image-viewer__btn.el-image-viewer__next')

        const icon = require('@/assets/images/icons/arrow-prev.svg')

        arrowPrev.innerHTML = `
            <span class="el-icon">
                <img src="${icon}" alt="">
            </span>
      `

        arrowNext.innerHTML = `
            <span class="el-icon">
                <img src="${icon}" alt="">
            </span>
      `
      })

    },
    onImageClose() {
      document.body.classList.remove('hide-all')
    }
  },
  computed: {
    hasGallery() {
      return this.newsItem.images && this.newsItem.images.length > 0
    },
    language() {
      return pageInstanceState.language
    },
    activeColumn() {
      return pageInstanceState.activeColumn
    },
    isAboutPage() {
      return this.$route.path.includes('/single')
    },
    isActiveBlock() {
      return pageInstanceState.activeBlock === 'single' || this.$route.path.includes('/single')
    },
    work() {
      return pageInstanceState.activeWork
    },
    srcList() {
      return this.newsItem.images.map(item => item.src)
    },
    newsItem() {

      return pageInstanceState.newsItem
    }
  },
  watch: {
    async '$route'(from, to) {

      // Получаем работу по id параметра
      if (from.path.includes('single')) {
        await pageInstanceController.getWork(this.$route.params.id)

        return
      }

      // Получаем работу по id параметра
      if (from.path.match(/\/news\/\d+/)) {

        pageInstanceState.newsItem = await pageInstanceController.getNewsItem(this.$route.params.id)
        let result = null
        pageInstanceState.newsColumn = []
        pageInstanceState.currentNewsPage = 1
        result = await pageController.getNews(pageInstanceState.currentNewsPage)
        pageInstanceState.newsColumn = [...pageInstanceState.newsColumn, ...result]

        pageInstanceState.currentNewsPage += 1
        result = await pageController.getNews(pageInstanceState.currentNewsPage)
        pageInstanceState.newsColumn = [...pageInstanceState.newsColumn, ...result]

        pageInstanceState.currentNewsPage += 1
        result = await pageController.getNews(pageInstanceState.currentNewsPage)
        pageInstanceState.newsColumn = [...pageInstanceState.newsColumn, ...result]

        return
      }
      // Включаем анимацию для текстового блока
      this.fade = true
      setTimeout(() => {
        this.fade = false
      }, 3000)
    }
  }
}
</script>

