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
import {convert} from '@/node/convert'

const {map} = Array.prototype

export default {
  props: ['w', 'h', 'fit', 'crop', 'ext', 'q'],
  methods: {
    convert (e) {
      const paths = map.call(e.dataTransfer.files, f => f.path)
      const {w, h, fit, crop, ext, q} = this

      if (!w && !h) {
        alert('width or width must be specified')
        return
      }

      convert(paths, {
        w, h, fit, crop, ext, q
      }).then(() => {

      })
    }
  }
}
</script>
