<script>
  import { ref, onBeforeUnmount } from '@nuxtjs/composition-api'
  import { nextTick } from 'vue'

  export default {
    name: 'ScrollText',
    props: {
      text: { type: String, default: '' },
      speed: { type: Number, default: 6 },
      automatic: { type: Boolean, default: false }
    },
    setup (props) {
      const scroller = ref(null)
      const scrolledText = ref(null)
      const getOverflowWidth = () => {
        return scrolledText.value
          ? scrolledText.value.clientWidth - scroller.value.clientWidth
          : 0
      }

      const textClass = ref('truncated')
      const textCssVars = ref({})
      const toggleScroll = async () => {
        textClass.value = null
        await nextTick()
        const overflowWidth = getOverflowWidth()
        if (overflowWidth > 0) {
          textClass.value = 'scrolling'
          textCssVars.value = {
            '--overflow-width': `-${overflowWidth + 4}px`,
            // distance in pixels divided by desired scroll speed
            // pad with 2 if overflow is small
            '--duration': `${overflowWidth / props.speed + 2}s`
          }
        } else {
          textClass.value = 'truncated'
        }
      }

      const resizeListener = ref(null)
      onBeforeUnmount(() => {
        window.removeEventListener('resize', resizeListener.value)
      })

      const onEnter = () => {
        toggleScroll()
        resizeListener.value = window.addEventListener('resize', toggleScroll)
      }
      const onLeave = () => {
        window.removeEventListener('resize', resizeListener.value)
        textClass.value = 'truncated'
      }
      return {
        scroller,
        scrolledText,
        textClass,
        textCssVars,
        onEnter,
        onLeave
      }
    }
  }
</script>

<template>
  <div
    id="scroller"
    ref="scroller"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <div
      ref="scrolledText"
      :class="textClass"
      :style="textCssVars"
      v-text="text"
    />
  </div>
</template>

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
