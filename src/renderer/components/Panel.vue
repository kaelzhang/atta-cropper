<template>
  <div>
    <drop-zone
      :w="w"
      :h="h"
      :fit="fit"
      :crop="crop"
      :ext="ext"
      :quality="quality"
    ></drop-zone>
    <div class="field">
      <label for="width">width: {{w}}</label>
      <input name="width" v-model.number="w" />
    </div>
    <div class="field">
      <label for="height">height: {{h}}</label>
      <input name="height" v-model.number="h" />
    </div>
    <div class="field" v-if="fit">
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
    <div class="field" v-if="fit && fit !== 'WIDTH_HEIGHT'">
      <label>crop: {{crop}}</label>
      <ul>
        <li
          v-for="o in crops"
          :key="o.key"
          :class="{selected: o.selected, disabled: o.disabled}"
          @click.prevent="selectCrop(o)"
        >{{o.index}}: {{o.key}}</li>
      </ul>
    </div>
    <div class="field">
      <label for="ext">ext: {{ext}}</label>
      <select name="ext" v-model="ext">
        <option>jpg</option>
        <option>png</option>
      </select>
    </div>
    <!-- <div class="field" v-if="">
      <label for="ext">ext: {{ext}}</label>
      <select name="ext" v-model="ext">
        <option>jpg</option>
        <option>png</option>
      </select>
    </div> -->
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
  getCrop,
  cropOptions,
  checkCrop,
  checkCropOptions
} from '@/node/props'

function watchSize () {
  const {
    w, h, fit, fits
  } = this
  const available = checkFitOptions(fits, w, h)

  if (!fit) {
    this.fit = available[0]
    return
  }

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

    const ext = 'jpg'
    const quality = 90

    return {
      w,
      h,
      fit,
      crop_index,
      fits,
      crops,
      ext,
      quality
    }
  },
  computed: {
    fitDesc () {
      return getFitDesc(this.fit)
    },

    crop () {
      return getCrop(this.crop_index)
    }
  },
  watch: {
    w: watchSize,
    h: watchSize,
    fit (fit) {
      const crop = getCrop(this.crop_index)
      const valid = checkCrop(crop, fit)
      if (!valid) {
        this.crop_index = -1
      }

      checkCropOptions(this.crops, fit, this.crop_index)
    }
  },
  components: {
    DropZone
  },
  methods: {
    selectCrop (o) {
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
