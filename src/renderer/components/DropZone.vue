<template>
<div>
  <div
    class="dropzone"
    id="dropzone"
    @drop.stop.prevent="open"
    @drag.stop.prevent
    @dragstart.stop.prevent
    @dragend.stop.prevent
    @dragover.stop.prevent
    @dragenter.stop.prevent
    @dragleave.stop.prevent
  >Drop Images Here</div>
  <input
    type="file"
    capture="camera"
    webkitdirectory
    directory
    multiple
    id="file"
  />
</div>
</template>

<style scoped>
.dropzone {
  width: 100px;
  height: 100px;
  background: #aaa;
}
</style>

<script>
export default {
  props: ['w', 'h', 'fit', 'crop'],
  methods: {
    open (e) {
      console.log(e.dataTransfer.files)
      console.log(this.w, this.h, this.fit, this.crop)
      // this.$electron.shell.openExternal(link)
    }
  }
}
</script>
