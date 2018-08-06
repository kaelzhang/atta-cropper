import Vue from 'vue'
import Cropper from './Cropper'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { Cropper },
  template: '<Cropper/>'
}).$mount('#app')
