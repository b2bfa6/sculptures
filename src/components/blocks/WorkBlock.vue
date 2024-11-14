<template>

  <div class="work">

    <div class="work__body">
      <!-- Изображения -->
      <div class="work__images">

        <swiper
            :space-between="29"
            :slides-per-view="1.3"
        >

          <swiper-slide v-for="image in work.gallery_items">
            <el-image
                :src="image.src"
                :preview-src-list="srcList"
                :initial-index="4"
                fit="cover"
                @click="onImageClick"
                @close="onImageClose"
            />
          </swiper-slide>
        </swiper>

      </div>
      <!-- Текстовый контент -->
      <div class="work__content">
        <!-- Заголовок -->
        <div class="work__title title" v-html="work.name"></div>
        <div class="work__size title" v-html="work.size"></div>
        <!-- Описание -->
        <div class="work__text" v-html="work.description"></div>
        <!-- Ссылка на всю коллекцию -->
        <router-link to="/gallery" class="work__link link" v-html="linkContent"></router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper } from 'swiper/vue/swiper.js';
import { SwiperSlide } from 'swiper/vue/swiper-slide.js';
import 'swiper/swiper-bundle.min.css'
import pageInstanceState from "@/pageInstance/page-instance.state";
import pageInstanceController from "@/pageInstance/page-instance.controller";

export default {
  name: "WorkBlock",
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      activeImage: null,
      activeImageSrc: null,
    }
  },

  methods: {
    onImageClick() {
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
    },
  },
  async created() {
    await pageInstanceController.getWork(this.$route.params.id)
  },
  computed: {
    windowWidth() {
      return window.innerWidth
    },
    work() {
      return pageInstanceState.activeWork
    },
    srcList() {
      return pageInstanceState.activeWork.gallery_items.map(item => item.src)
    },
    linkContent() {
      return pageInstanceState.content['go_to_collection']
    }
  },

}
</script>
