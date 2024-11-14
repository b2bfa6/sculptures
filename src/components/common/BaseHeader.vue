<template>
  <div :class="{active: isActive, main: isHomePage}" class="header">
    <div class="header__top">
      <button type="button" @click="toggleButton" :class="{active: isActive}" class="header__icon icon">
        <span></span>
        <span></span>
      </button>
      <div v-if="showArrow" @click="$router.go(-1)" class="header__button-prev">
        <img src="@/assets/images/icons/arrow-prev.svg" alt="">
      </div>
      <div :class="{invisible: isLanguagesInvisible}" class="header__languages">
        <base-languages @close-menu="closeMenu" />
      </div>
    </div>
    <div :class="{active: isActive}" class="header__menu menu-header">
      <div class="menu-header__body">
        <ul class="menu-header__list">
          <li @click="closeMenu" class="menu-header__item"><router-link class="menu-header__link" to="/about" v-html="menuItemAbout"></router-link></li>
          <li @click="closeMenu" class="menu-header__item"><router-link class="menu-header__link" to="/gallery" v-html="menuItemGallery"></router-link></li>
          <li @click="closeMenu" class="menu-header__item"><router-link class="menu-header__link" to="/news" v-html="menuItemNews"></router-link></li>
        </ul>
        <ul class="menu-header__base-socials base-socials">
          <li>
            <a href="https://www.instagram.com/ulafonberber/?igshid=OGQ5ZDc2ODk2ZA%3D%3D" class="base-socials__link">
              <img :src="instagramIcon" alt="">
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/@ULAFONBERBER" class="base-socials__link">
              <img :src="youtubeIcon" alt="">
            </a>
          </li>
          <li>
            <a href="https://t.me/ulafonberber_com" class="base-socials__link">
              <img :src="telegramIcon" alt="">
            </a>
          </li>
        </ul>
        <div class="menu-header__label" v-html="menuPhoneHeading"></div>
        <a href="" class="menu-header__phone" v-html="menuPhone"></a>
        <div class="menu-header__label" v-html="menuLinksHeading"></div>
        <div class="menu-header__bottom" v-html="menuLinks"></div>
      </div>
    </div>
  </div>
</template>

<script>
import pageInstanceState from "@/pageInstance/page-instance.state";
import pageInstanceController from "@/pageInstance/page-instance.controller";
import BaseLanguages from "@/components/common/BaseLanguages";


export default {
  name: "BaseHeader",
  components: {BaseLanguages},

  props: {
    showArrow: {
      type: Boolean,
      default: false
    },
    isLanguagesInvisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isActive: false,
      hasBackground: false,
      isHomePage: false,
      telegramIcon: require('@/assets/images/icons/telegram.svg'),
      youtubeIcon: require('@/assets/images/icons/youtube.svg'),
      instagramIcon: require('@/assets/images/icons/instagram.svg'),

    }
  },

  methods: {
    toggleButton() {
      this.isActive = !this.isActive
      if (document.body.classList.contains('hidden')) {
        document.body.classList.remove('hidden')
      } else {
        document.body.classList.add('hidden')
      }
    },
    closeMenu() {
      this.isActive = false
      document.body.classList.remove('hidden')
    },

  },
  computed: {
    menuPhone() {
      return pageInstanceState.content['menu_phone']
    },
    menuLinks() {
      return pageInstanceState.content['menu_links']
    },
    menuLinksHeading() {
      return pageInstanceState.content['menu_links_heading']
    },
    menuPhoneHeading() {
      return pageInstanceState.content['menu_phone_heading']
    },
    menuItemAbout() {
      return pageInstanceState.content['menu_item_about']
    },
    menuItemGallery() {
      return pageInstanceState.content['menu_item_gallery']
    },
    menuItemNews() {
      return pageInstanceState.content['menu_item_news']
    },

  },
}
</script>
