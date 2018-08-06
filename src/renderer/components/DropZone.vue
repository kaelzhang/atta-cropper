<template>
<div>
  <div
    class="dropzone"
    id="dropzone"
    @drag.stop.prevent
    @dragstart.stop.prevent
    @dragend.stop.prevent
    @dragover.stop.prevent
    @dragenter.stop.prevent
    @dragleave.stop.prevent
    @drop.stop.prevent="convert"
  >Drop Images Here</div>
  <!-- <input
    type="file"
    capture="camera"
    webkitdirectory
    directory
    multiple
    id="file"
  /> -->
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
    convert (e) {
      console.log(e.dataTransfer.files)
      console.log(this.w, this.h, this.fit, this.crop)
    }
  }
}
</script>
