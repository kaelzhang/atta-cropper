<template>
<div class="container">
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
  >Drop Images or Directories Here</div>
  <div>progress: {{progress}}%, {{finished}} / {{total}}</div>
  <div
    :class="{success: success, fail: !success, message: true}"
    v-if="message"
  >{{message}}</div>
</div>
</template>

<style scoped>
.dropzone {
  width: 100px;
  height: 100px;
  background: #aaa;
}

.container {
  margin-bottom: 20px
}

.success {
  color: green
}

.fail {
  color: red
}

</style>

<script>
import {convert} from '@/node/convert'

const {map} = Array.prototype

export default {
  props: ['w', 'h', 'fit', 'crop', 'ext', 'q'],
  data () {
    return {
      message: '',
      success: true,
      progress: 100,
      processing: false,
      finished: 0,
      total: 0
    }
  },
  methods: {
    convert (e) {
      const paths = map.call(e.dataTransfer.files, f => f.path)
      const {w, h, fit, crop, ext, q} = this

      if (!w && !h) {
        alert('width or width must be specified')
        return
      }

      if (this.processing) {
        alert('the last task is still processing')
        return
      }

      this.processing = true
      this.progress = 0

      convert(
        paths, {
          w, h, fit, crop, ext, q
        },
        (finished, total)  => {
          this.finished = finished
          this.total = total
          this.progress = parseInt(finished / total * 100)
        }
      )
      .then(() => {
        this.success = true
        this.message = '搞定！'
        this.processing = false
        this.progress = 100
      })
      .catch(err => {
        this.success = false
        this.message = err.message
        this.processing = false
        this.progress = 100
      })
    }
  }
}
</script>
