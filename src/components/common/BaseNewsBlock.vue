<template>
  <div v-if="item.main_image.src" class="news__item item-news">
    <div class="item-news__image">
      <el-image
          :style="{'max-width': item.main_image.width + 'px', 'max-height': item.main_image.height + 'px'}"
          :src="'https://ulafonberber.com' + item.main_image.src"
          alt=""
      />
    </div>

    <div v-if="item.date" class="item-news__date">{{item.date}}</div>
    <div v-if="item.name" class="item-news__name" v-html="item.name"></div>
    <p v-html="item.description" class="item-news__text"></p>
    <router-link v-if="item.source === 'Другое'" :to="'/news/' + item.id" v-html="news_view" class="item-news__more"></router-link>
  </div>


  <div v-if="item.video !== ''" class="news__item item-news">
    <div v-html="item.video" class="item-news__video"></div>

    <div v-if="item.date" class="item-news__date">{{item.date}}</div>
    <div v-if="item.name" class="item-news__name" v-html="item.name"></div>
    <p class="item-news__text">{{item.description}}</p>
    <a v-if="item.source === 'Другое'" :href="item.link" class="item-news__more" v-html="news_view"></a>
  </div>
</template>

<script>
import Swiper from "swiper";
import pageInstanceState from "@/pageInstance/page-instance.state";

export default {
  name: "BaseNewsBlock",
  props: {
    item: {
      required: true
    }
  },
  data() {
    return {
      slider: null,
      swiperOptions: {
        autoHeight: true,
        loop: true,
        spaceBetween: 20
      }
    }
  },
  computed: {
    news_view() {
      return pageInstanceState.content['news_view']

    },
  },
  mounted() {
    this.slider = new Swiper(this.$refs.swiperRef, this.swiperOptions)

  },
  methods() {

  }
}
</script>


<style scoped lang="scss">

</style>

