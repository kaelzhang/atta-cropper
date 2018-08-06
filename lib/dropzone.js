'use strict'

module.exports = dropzone

const $ = require('jquery')
const {EventEmitter} = require('events')

function dropzone (element) {
  return new Dropzone(element)
}


const DRAG_EVENS = 'drag dragstart dragend dragover dragenter dragleave drop'

class Dropzone extends EventEmitter {
  constructor (element) {
    super()
    this.el = $(element)
    this._init()
  }

  _init () {
    this.el
    .on(DRAG_EVENS, (e) => {
      e.preventDefault()
      e.stopPropagation()
    })
    .on('drop', (e) => {
      this.emit('drop', e.originalEvent)
    })
  }
}
