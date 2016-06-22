'use strict'

const gm = require('gm').subClass({
  imageMagick: true
})


class Image {
  constructor (filename) {
    this.filename = filename
  }

  size (width, height) {
    this.width = width
    this.height = height
    return this
  }

  write (output, callback) {
    gm(this.filename).size(function (err, size) {
      if (err) {
        return callback(err)
      }

      let w = size.width
      let h = size.height
      let x
      let y
      let s

      if (w > h) {
        y = 0
        x = (w - h) / 2
        s = h

      } else {
        x = 0
        y = h - w
        s = w
      }

      this.crop(s, s, x, y)
      this.resize(this._size)
      this.write(output, callback)
    })
  }
}


module.exports = Image
