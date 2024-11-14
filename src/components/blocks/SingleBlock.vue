<template>
  <div ref="single" class="single">
    <div class="single__body">
      <!-- Изображения -->
      <div class="single__images">
        <router-link to="/gallery" class="single__button">
          <img src="@/assets/images/icons/arrow-prev.svg" alt="">
          <span v-if="language === 'ru'">Галерея</span>
          <span v-if="language === 'en'">Gallery</span>
        </router-link>

        <div v-for="(image, index) in work.gallery_items" class="single__image">
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
          />
        </div>
      </div>

      <!-- Текстовый контент -->
      <div class="single__content">
        <!-- Заголовок -->
        <div class="single__title title" :class="{hidden: fade}"  v-html="work.name"></div>
        <!-- Дополнительные данные -->
        <div class="single__size title" :class="{hidden: fade}" v-html="work.size"></div>
        <!-- Описание -->
        <div class="single__text" :class="{hidden: fade}" v-html="work.description"></div>

      </div>
    </div>
  </div>
</template>

<script>
import pageInstanceState from "@/pageInstance/page-instance.state";
import 'element-plus/dist/index.css'
import icon from "@/assets/images/icons/arrow-prev.svg";
import pageInstanceController from "@/pageInstance/page-instance.controller";

export default {
  name: "single-block",
  data() {
    return {
      wasScrolled: false,
      lockScroll: false,
      fade: false,
      initialIndex: 0
    }
  },
  async created() {
    const result = await pageInstanceController.getWork(this.$route.params.id)
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
      return pageInstanceState.activeWork.gallery_items.map(item => item.src)
    }
  },
  watch: {
    async '$route'(from, to) {

      // Получаем работу по id параметра
      if (from.path.includes('single')) {
        await pageInstanceController.getWork(this.$route.params.id)

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

