<template>
  <div
      @scroll="onScroll($event)"
      @wheel="onScrollNewsDebounce"
      ref="news"
      class="works news"
      :class="{
        active: isActiveBlock,
        lock: isLockedPage,
        'is-first': isFirst,
        'is-second': isSecond
      }">
    <!--  Оболочка  -->
    <div  class="works__body" ref="newsBody">
      <template v-if="page === 1 && windowWidth > 991.98">
        <ul class="works__togglers">
          <li @click="updateNews(section.id, section.description, section)" v-for="(section, index) in newsSections" :class="{'active': activeNewsSection.name === section.name}" class="works__toggler">{{section.name}}</li>
        </ul>
        <div v-if="description" v-html="description" class="works__description"></div>
      </template>
      <perfect-scrollbar>


        <template v-if="page === 1">
          <div class="news__title" v-html="news_social"></div>
          <BaseNewsBlock :key="item.id" :item="item" v-for="item in finalNews" />
        </template>

        <template v-if="page === 2 || page === 3">
          <BaseNewsBlock :key="item.id" :item="item" v-for="item in finalNews" />
        </template>

      </perfect-scrollbar>

    </div>
  </div>
</template>

<script>
import pageController from "@/pageInstance/page-instance.controller";
import pageInstanceState, {pageStateInit} from "@/pageInstance/page-instance.state";
import gsap from "gsap";
import Swiper from 'swiper'
import 'swiper/swiper-bundle.min.css';
import {debounce} from "@/helpers";
import BaseNewsBlock from "@/components/common/BaseNewsBlock";
import {PerfectScrollbar} from "vue3-perfect-scrollbar";
export default {
  name: "NewsBlock",
  components: {BaseNewsBlock, PerfectScrollbar},


  data() {
    return {

      wasLoaded: false,
      wasScrolled: false,
      isLockedPage: false,
      fade: false,
      news: [],
      maxScrollTop: 0,
      lockScroll: false,
      hasMoreNews: true,
    }
  },

  props: {
    page: {

    },
    column: {
      type: Array,
      default: []
    },
    isCentral: {
      type: Boolean,
      default: false
    },
    isFirst: {
      type: Boolean,
      default: false
    },
    isSecond: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    isSingleNews() {
      return this.$route.path.match(/\/news\/\d+/) && pageInstanceState.activeBlock === 'single'
    },
    news_social() {
      return pageInstanceState.content['news_social']

    },
    finalNews() {
      const id = this.$route.params.id
      if (this.page === 1) {
        return pageInstanceState.firstNewsColumn
      } else if (this.page === 2) {
        return pageInstanceState.secondNewsColumn
      } else if (this.page === 3) {
        return pageInstanceState.newsColumn.filter(item => {
          return item.id !== id
        })

      }

    },
    currentNewsPage() {
      return pageInstanceState.currentNewsPage
    },
    currentNewsSection() {
      return pageInstanceState.currentNewsSection
    },
    description() {
      return pageInstanceState.activeNewsDescription
    },

    newsSections() {
      return pageInstanceState.newsSections

    },
    isLoadingNews() {
      return pageInstanceState.isLoadingNews
    },
    languageCode() {
      return pageInstanceState.language
    },
    activeNewsSection() {
      return pageInstanceState.activeNewsSection
    },
    windowWidth() {
      return pageInstanceState.windowWidth
    },
    isActiveBlock() {
      return pageInstanceState.activeBlock === 'news'
    },
    lock() {
      return pageInstanceState.lock
    },
    isAboutPage() {
      return this.$route.path.includes('/about')
    },
    isSinglePage() {
      return this.$route.path.includes('/single')
    },

    images() {
      // Разделяем поровну изображения для первой и второй колокни
      const length = pageInstanceState.works.length


      if (this.isAboutPage && this.page === 1) {
        return pageInstanceState.works.slice()
      }
      if (this.isSinglePage && this.page === 3) {
        return pageInstanceState.works.slice()
      }

      if (this.page === 1) {

        return pageInstanceState.works.slice(0, Math.floor(length / 2))

      } else {
        return pageInstanceState.works.slice(Math.floor(length / 2), pageInstanceState.works.length + 1)
      }

    }
  },
  async mounted() {

    if (this.page === 1) {
      await pageController.getNewsSections()

      pageInstanceState.activeNewsSection = pageInstanceState.activeNewsSection.description ? pageInstanceState.activeNewsSection : pageInstanceState.newsSections[0]

    }

    // if (!document.querySelector('.single-page.news-page')) {
    //   let result = null
    //   // pageInstanceState.secondNewsColumn = []
    //   pageInstanceState.currentNewsPage = 1
    //   result = await pageController.getNews(pageInstanceState.currentNewsPage)
    //   pageInstanceState.secondNewsColumn = [...pageInstanceState.firstNewsColumn, ...result]
    //
    //   pageInstanceState.currentNewsPage += 1
    //   result = await pageController.getNews(pageInstanceState.currentNewsPage)
    //   pageInstanceState.secondNewsColumn = [...pageInstanceState.firstNewsColumn, ...result]
    //
    //   pageInstanceState.currentNewsPage += 1
    //   result = await pageController.getNews(pageInstanceState.currentNewsPage)
    //   pageInstanceState.secondNewsColumn = [...pageInstanceState.secondNewsColumn, ...result]
    //
    //   pageInstanceState.currentNewsPage += 1
    //   result = await pageController.getNews(pageInstanceState.currentNewsPage)
    //   pageInstanceState.secondNewsColumn = [...pageInstanceState.secondNewsColumn, ...result]
    //
    // }

    pageInstanceState.activeNewsDescription = pageInstanceState.activeNewsSection.description
  },
  async created() {
    pageStateInit()

    if (this.page === 3) {
      let result = null
      pageInstanceState.currentColumnNewsPage = 1
      result = await pageController.getNews(pageInstanceState.currentColumnNewsPage)
      pageInstanceState.newsColumn = [...pageInstanceState.newsColumn, ...result]

      pageInstanceState.currentColumnNewsPage += 1
      result = await pageController.getNews(pageInstanceState.currentColumnNewsPage)
      pageInstanceState.newsColumn = [...pageInstanceState.newsColumn, ...result]

      pageInstanceState.currentColumnNewsPage += 1
      result = await pageController.getNews(pageInstanceState.currentColumnNewsPage)
      pageInstanceState.newsColumn = [...pageInstanceState.newsColumn, ...result]

      pageInstanceState.currentColumnNewsPage += 1
      result = await pageController.getNews(pageInstanceState.currentColumnNewsPage)
      pageInstanceState.newsColumn = [...pageInstanceState.newsColumn, ...result]
    }
    // if (document.querySelector('.single-page.news-page')) {
    //   let result = null
    //   // pageInstanceState.secondNewsColumn = []
    //   pageInstanceState.currentColumnNewsPage = 1
    //   result = await pageController.getNews(pageInstanceState.currentColumnNewsPage)
    //   pageInstanceState.secondNewsColumn = [...pageInstanceState.newsColumn, ...result]
    //
    //   pageInstanceState.currentColumnNewsPage += 1
    //   result = await pageController.getNews(pageInstanceState.currentColumnNewsPage)
    //   pageInstanceState.secondNewsColumn = [...pageInstanceState.newsColumn, ...result]
    //
    //   pageInstanceState.currentColumnNewsPage += 1
    //   result = await pageController.getNews(pageInstanceState.currentColumnNewsPage)
    //   pageInstanceState.secondNewsColumn = [...pageInstanceState.newsColumn, ...result]
    //
    //   pageInstanceState.currentColumnNewsPage += 1
    //   result = await pageController.getNews(pageInstanceState.currentColumnNewsPage)
    //   pageInstanceState.secondNewsColumn = [...pageInstanceState.newsColumn, ...result]
    //
    // }
  },
  watch: {
    '$route'(from, to) {

      // if (this.page === 2 && to.path.match(/\/news\/\d+/)) {
      //   pageInstanceState.currentNewsPage = 1
      //   pageInstanceState.secondNewsColumn = []
      //   pageInstanceState.firstNewsColumn = []
      // }
      // if (from.path.match(/\/news\/\d+/)) {
      //   await this.getNews()
      //
      // }

      const coords = this.$refs.news.getBoundingClientRect()

      if (pageInstanceState.windowWidth < 991.98) return

      if (to.path === '/' && from.path === '/') return

       // Анимирование колонок, в зависимости от текущей страницы
      if (from.path.includes('/about')) {
        if (this.isFirst) {
          gsap.to('.works.is-first', {
            height: '100%',
            top: '0',
            width: '170px',
            left: "calc(100% - 170px)",
            duration: 0.09,
            ease: 'ease',
          })
        }

        if (this.isSecond) {

          gsap.to('.works.is-second', {
            height: '100%',
            opacity: 0,
            duration: 0,
            ease: 'ease',
          })
        }

      }



     if (from.path === '/') {
        if (this.isFirst) {
          gsap.to('.works.is-first', {
            height: '100%',
            left: '50%',
            top: 0,
            width: '25%',
            duration: 0.09,
            ease: 'ease',
          })
        }
        if (this.isSecond) {
          gsap.to('.works.is-second', {
            height: '100%',
            left: 'calc(100% - 25%)',
            top: 0,
            width: '25%',
            duration: 0.09,
            ease: 'ease',
            opacity: 1
          })
        }
      }



      if (from.path.includes('/single')) {
        gsap.to('.works.is-second', {
          left: 'calc(100% - 170px)',
          top: 0,
          width: '170px',
          height: '100%',
          opacity: 1,
          duration: 0.03,
          ease: 'ease',
        })
      }

      if (from.path.includes('/news')) {
        if (this.isFirst) {
          gsap.to('.works.is-first', {
            height: '100%',
            left: '220px',
            top: 0,
            width: '43.5%',
            duration: 0.03,
            ease: 'ease',
          })
        }
        if (this.isSecond) {
          gsap.to('.works.is-second', {
            height: '100%',
            left: '57.5%',
            top: 0,
            width: '43.5%',
            duration: 0.03,
            ease: 'ease',
            opacity: 1,
          })
        }
      }
    },

  },

  methods: {
    debounce,

    onScrollNewsDebounce: debounce(function () {
      this.onScrollNews();
    }, 100),

    async getNews(section = null) {
      pageInstanceState.isLoadingNews = true
      pageInstanceState.currentNewsPage += 1

      try {
        let result = await pageController.getNews(pageInstanceState.currentNewsPage)

        // if (this.page === 1 && this.currentNewsPage === 2) {
        //   result = await pageController.getNews(1)
        // } else if (this.page === 2 && this.currentNewsPage === 1) {
        //   result = await pageController.getNews(2)
        // } else {
        //   result =
        // }
        // if (result.length === 0) return;

        if (this.page === 1) {
          pageInstanceState.firstNewsColumn = [...pageInstanceState.firstNewsColumn, ...result]
        } else if (this.page === 2) {
          pageInstanceState.secondNewsColumn = [...pageInstanceState.secondNewsColumn, ...result]
        } else if (this.page === 3) {
          pageInstanceState.newsColumn = [...pageInstanceState.newsColumn, ...result]
        }

        if (!result?.length) {
          pageInstanceState.currentNewsPage -= 1
          this.hasMoreNews = false
        }

        pageInstanceState.isLoadingNews = false
      } catch (e) {
        pageInstanceState.isLoadingNews = false
      }


    },

    async updateNews(id, description, item) {
      // this.getNews()

      pageInstanceState.activeNewsDescription = description
      pageInstanceState.activeNewsSection = item

      pageInstanceState.isLoadingNews = false

      pageInstanceState.currentNewsPage = 1

      pageInstanceState.firstNewsColumn = []
      pageInstanceState.secondNewsColumn = []

      pageInstanceState.firstNewsColumn = await pageController.getNews(pageInstanceState.currentNewsPage)
      pageInstanceState.currentNewsPage += 1
      pageInstanceState.secondNewsColumn = await pageController.getNews(pageInstanceState.currentNewsPage)
    },
    async onImageClick(id) {
      // Получаем работу по клику на изображение
      await pageController.getWork(id)
    },
    onScroll() {
      // Исключаем страницы, на которых мы не будем расширять колонку галлереи
      if (this.$route.path.includes('/about') || this.$route.path.includes('/single')) return

      // Если элемент еще не скроллился ни разу
      // if (!this.wasScrolled && !this.isActiveBlock) {
      //   this.$refs.news.scrollTo(0, 0)
      // }

      // Если пользователь начинает скроллить блок, то делаем его активным и меняем адрес
      // if (!this.isActiveBlock && !pageInstanceState.lock) {
      //   pageInstanceState.activeBlock = 'news'
      //   pageInstanceState.lock = true
      //   pageInstanceState.currentColumnWidth = pageInstanceState.columnWidth.gallery
      //
      //   this.$router.push('news')
      //
      //   this.$emit('expand-third-column')
      //
      //   this.lockScroll = true
      //   setTimeout(function() {
      //     this.lockScroll = false
      //
      //     // this.wasScrolled = true
      //     pageInstanceState.lock = false
      //   }.bind(this), 600)
      // }



    },
    async onScrollNews() {
      const PADDING = Math.min(
          250,
          this.windowWidth
      );


      // const isFooter =
      //     window.innerHeight +
      //     FOOTER_HEIGHT +
      //     e.scrollY -
      //     window?.document.body.scrollHeight >
      //     0;

      // const hasMore = total > objectLength;


      // if (!isFooter || this.isLoadingNews || !hasMore) return;

      if (!this.hasMoreNews) return
      if (this.isLoadingNews && !document.querySelector('.single-page.news-page')) return

      // this.getNews()
      if (this.isLoadingNews) return

      // высота всей секции
      const scrollHeight = Math.max(
          this.$refs.news.scrollHeight,
          this.$refs.news.offsetHeight,
          this.$refs.news.clientHeight,
      );

      if (this.$refs.news.scrollTop > this.maxScrollTop) {
        this.maxScrollTop = this.$refs.news.scrollTop

        if(this.$refs.news.scrollTop + PADDING >= scrollHeight - innerHeight) {
          await this.getNews()
          await this.getNews()
        }

      }
    }
  },

}
</script>
