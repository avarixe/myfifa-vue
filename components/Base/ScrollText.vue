<template>
  <div
    id="scroller"
    ref="scroller"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
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
      speed: { type: Number, default: 6 },
      automatic: { type: Boolean, default: false }
    },
    data: () => ({
      textClass: 'truncated',
      textCssVars: {},
      resizeListener: null
    }),
    beforeDestroy () {
      window.removeEventListener('resize', this.resizeListener)
    },
    methods: {
      onEnter () {
        this.toggleScroll()
        this.resizeListener = window.addEventListener('resize', this.toggleScroll)
      },
      onLeave () {
        window.removeEventListener('resize', this.resizeListener)
        this.textClass = 'truncated'
      },
      toggleScroll () {
        this.textClass = null
        this.$nextTick(() => {
          if (this.hasOverflow()) {
            this.textClass = 'scrolling'
            this.textCssVars = {
              '--overflow-width': `-${this.getOverflowWidth() + 4}px`,
              '--duration': `${this.computeScrollDuration()}s`
            }
          } else {
            this.textClass = 'truncated'
          }
        })
      },
      hasOverflow () {
        return this.getOverflowWidth() > 0
      },
      getOverflowWidth () {
        return this.$refs.text
          ? this.$refs.text.clientWidth - this.$refs.scroller.clientWidth
          : 0
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
      &.scrolling {
        animation: text-scroll var(--duration) linear infinite;
      }
      &.truncated {
        text-overflow: ellipsis;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }

  @keyframes text-scroll {
    0% { transform: translateX(0) }
    40% { transform: translateX(var(--overflow-width)) }
    50% { transform: translateX(var(--overflow-width)) }
    80% { transform: translateX(0) }
  }
</style>
