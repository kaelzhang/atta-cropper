<template>
  <div>
    <drop-zone :w="w" :h="h" :fit="fit" :crop="crop"></drop-zone>
    <div class="row">
      <label for="width">width: {{w}}</label>
      <input name="width" v-model.number="w" />
    </div>
    <div class="row">
      <label for="height">height: {{h}}</label>
      <input name="height" v-model.number="h" />
    </div>
    <div class="row">
      <label for="width">fit: {{fitDesc}}</label>
      <select name="fit" v-model="fit">
        <option
          v-for="o in fits"
          :value="o.value"
          :key="o.value"
          :disabled="o.disabled"
        >{{o.desc}}</option>
      </select>
    </div>
  </div>
</template>

<script>
import DropZone from './DropZone'
import {
  checkFitOptions,
  fitOptions,
  getFitDesc,
  checkFit
} from '@/node/props'

function watchSize () {
  const {
    w, h, fit, fits
  } = this
  const available = checkFitOptions(fits, w, h)
  const valid = checkFit(fit, w, h)

  if (!valid) {
    this.fit = available[0]
  }
}

export default {
  data () {
    const w = 100
    const h = 100
    const fits = fitOptions()
    checkFitOptions(fits, w, h)

    const fit = 'NONE'
    const crop = []

    return {
      w,
      h,
      fit,
      crop,
      fits
    }
  },
  computed: {
    fitDesc () {
      console.log('this.fit', this.fit)
      return getFitDesc(this.fit)
    }
  },
  watch: {
    w: watchSize,
    h: watchSize,
    fit () {
      console.log(arguments)
    }
  },
  components: {
    DropZone
  }
}
</script>
