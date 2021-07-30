<template>
  <div
    id="scroller"
    ref="scroller"
  >
    <div
      ref="text"
      :class="textClass"
      :style="textCssVars"
      v-text="text"
    />
  </div>
</template>

<script>
  export default {
    name: 'ScrollText',
    props: {
      text: { type: String, default: '' },
      speed: { type: Number, default: 6 }
    },
    data: () => ({
      textClass: null,
      textCssVars: {},
      resizeListener: null
    }),
    mounted () {
      this.toggleScroll()
      this.resizeListener = window.addEventListener('resize', this.toggleScroll)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.resizeListener)
    },
    methods: {
      toggleScroll () {
        if (this.isTruncated()) {
          this.textClass = 'truncated'
          this.textCssVars = {
            '--overflow-width': `-${this.getOverflowWidth() + 4}px`,
            '--duration': `${this.computeScrollDuration()}s`
          }
        } else {
          this.textClass = null
        }
      },
      isTruncated () {
        return this.getOverflowWidth() > 0
      },
      getOverflowWidth () {
        return this.$refs.text.clientWidth - this.$refs.scroller.clientWidth
      },
      computeScrollDuration () {
        // distance in pixels divided by desired scroll speed
        // pad with 2 if overflow is small
        return this.getOverflowWidth() / this.speed + 2
      }
    }
  }
</script>

<style scoped lang="scss">
  #scroller {
    overflow: hidden;
    div {
      width: max-content;
      &.truncated {
        animation: text-scroll var(--duration) linear infinite;
      }
    }
  }

  @keyframes text-scroll {
    10% { transform: translateX(0) }
    40% { transform: translateX(var(--overflow-width)) }
    60% { transform: translateX(var(--overflow-width)) }
    90% { transform: translateX(0) }
  }
</style>
