<template>
  <div>
    <drop-zone :w="w" :h="h" :fit="fit" :crop="crop"></drop-zone>
    <div class="field">
      <label for="width">width: {{w}}</label>
      <input name="width" v-model.number="w" />
    </div>
    <div class="field">
      <label for="height">height: {{h}}</label>
      <input name="height" v-model.number="h" />
    </div>
    <div class="field">
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
    <div class="field">
      <ul>
        <li
          v-for="o in crops"
          :key="o.key"
          :class="{selected: o.selected, disabled: o.disabled}"
          @click.prevent="selectCrop(o)"
        >{{o.index}}: {{o.key}}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.disabled {
  opacity: 0.3
}

.selected {
  color: green
}
</style>

<script>
import DropZone from './DropZone'
import {
  checkFitOptions,
  fitOptions,
  getFitDesc,
  checkFit,
  cropOptions,
  checkCrop,
  checkCropOptions
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
    const crop_index = -1
    const crops = cropOptions()
    checkCropOptions(crops, fit, crop_index)

    return {
      w,
      h,
      fit,
      crop_index,
      fits,
      crops
    }
  },
  computed: {
    fitDesc () {
      console.log('this.fit', this.fit)
      return getFitDesc(this.fit)
    },

    crop () {
      const selected = this.crops[this.crop_index]
      return selected
        ? selected.crop
        : [null, null]
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
  },
  methods: {
    selectCrop (o) {
      console.log(o)
      const {fit} = this
      const valid = checkCrop(o.crop, fit)

      if (valid) {
        const {index} = o
        this.crop_index = index

        checkCropOptions(this.crops, fit, index)
      }
    }
  }
}
</script>
