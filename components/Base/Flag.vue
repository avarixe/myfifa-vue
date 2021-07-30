<template>
  <div :class="['flag', `size-${size}`]">
    <img :src="imageUrl">
  </div>
</template>

<script>
  export default {
    name: 'VFlag',
    props: {
      iso: { type: String, required: true },
      size: { type: String, default: 'm', validator: v => ['s', 'm', 'l', 'xl'].indexOf(v) >= 0 }
    },
    computed: {
      imageUrl () {
        const size = this.size === 'xl' ? 'l' : this.size
        const iso = this.iso && this.iso.toUpperCase()
        return iso
          ? `//cdn.jsdelivr.net/gh/avarixe/flagpack-core/svg/${size}/${iso}.svg`
          : null
      }
    }
  }
</script>

<style scoped lang="scss">
  .flag {
    display: inline-block;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    &.size {
      &-s {
        width: 16px;
        height: 12px;
        border-radius: 1px;
      }
      &-m {
        width: 20px;
        height: 15px;
        border-radius: 1.5px;
      }
      &-l {
        width: 32px;
        height: 24px;
        border-radius: 2px;
      }
      &-xl {
        width: 60px;
        height: 40px;
        border-radius: 3px;
      }
    }
    &::before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      display: block;
      mix-blend-mode: overlay;
      box-sizing: border-box;
      border: 1px solid rgba(0, 0, 0, .5);
      mix-blend-mode: overlay;
      border-radius: 1px;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
