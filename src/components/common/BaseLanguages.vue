<template>
  <ul class="languages" :class="{scrolled: wasPageScrolled}">
    <li
        :class="{active: language.code === languageCode}"
        v-for="language in languages"
        @click="changeLang(language.code, $event)"
        class="language">{{language.name}}</li>
  </ul>
</template>

<script>
import pageInstanceController from "@/pageInstance/page-instance.controller";
import pageInstanceState from "@/pageInstance/page-instance.state";
import pageController from "@/pageInstance/page-instance.controller";

export default {
  name: "BaseLanguages",
  props: {
    // isAbsolute: {
    //   type: Boolean,
    //   default: false
    // },
    wasPageScrolled: {
      type: Boolean,
      default: false
    }
  },
  async created() {
    this.languages = await pageInstanceController.getLanguages()
  },
  data() {
    return {
      languages: [],
    }
  },
  methods: {
    async changeLang(lang, event) {
      document.querySelector('.language.active').classList.remove('active')

      event.target.classList.add('active')

      pageInstanceState.language = lang
      document.body.classList.remove('hidden')

      pageInstanceController.getWorks()
      pageInstanceController.getLocalization()
      pageInstanceController.getWork(this.$route.params.id)
      pageInstanceController.getSections()
      pageInstanceState.maxNewsScrollTop = 0
      await pageInstanceController.getNewsSections()
      pageInstanceState.activeNewsSection = pageInstanceState.newsSections[0]
      pageInstanceState.isLoadingNews = false

      pageInstanceState.currentNewsPage = 1
      pageInstanceState.activeNewsDescription = pageInstanceState.activeNewsSection.description
      pageInstanceState.firstNewsColumn = []
      pageInstanceState.secondNewsColumn = []

      pageInstanceState.firstNewsColumn = await pageController.getNews(pageInstanceState.currentNewsPage)
      pageInstanceState.currentNewsPage += 1
      pageInstanceState.secondNewsColumn = await pageController.getNews(pageInstanceState.currentNewsPage)


      if (document.querySelector('.single-page.news-page')) {
        pageInstanceState.newsItem = await pageInstanceController.getNewsItem(this.$route.params.id)

      }


      if (this.languageCode === 'en') {
        pageInstanceState.activeSection = 'All works'
        pageInstanceState.activeWorkDescription = ''
      } else if (this.languageCode === 'ru') {
        pageInstanceState.activeSection = 'Все работы'
        pageInstanceState.activeWorkDescription = ''
      }

      this.$emit('close-menu')
    }
  },
  computed: {
    languageCode() {
      return pageInstanceState.language
    },
    animationDone() {
      return pageInstanceState.animation.done
    }
  }
}
</script>


<style scoped lang="scss">

</style>
