const gm = require('gm').subClass({
  imageMagick: true
})

const replaceExt = (str, ext) => str.replace(/(\.[a-z0-9]+)?$/i, `.${ext}`)

export default class Image {
  constructor (filename) {
    this.filename = filename
  }

  size (options) {
    this.crop_options = options
    return this
  }

  quality (quality) {
    this.q = quality
    return this
  }

  format (ext) {
    this.ext = ext
    return this
  }

  _write (output, callback) {
    console.log('ext', this.ext)
    output = replaceExt(output, this.ext)
    const self = this

    gm(this.filename).size(function (err, size) {
      if (err) {
        return callback(err)
      }

      const {
        width: ow,
        height: oh
      } = size

      const {
        fit,
        crop: [ch, cv]
      } = self.crop_options

      let {
        w, h
      } = self.crop_options

      const {q, ext} = self

      if (fit === 'WIDTH') {
        h = h || oh * w / ow
      }

      const need_resize = fit !== 'NONE'

      if (true) {

      }

      // if (w > h) {
      //   y = 0
      //   x = (w - h) / 2
      //   s = h

      // } else {
      //   x = 0
      //   y = h - w
      //   s = w
      // }
      // this.crop(100, 100, 0, 0)

      // /Users/kael/Desktop/a/aaa__w100_h100_fitNONE_cropNONE_q90.jpg

      this.resize(500, 300, '<')
      // this.crop(s, s, x, y)
      // this.resize(this._size)
      this.write(output, callback)
    })
  }

  write (output) {
    return new Promise((resolve, reject) => {
      this._write(output, err => {
        if (err) {
          return reject(err)
        }

        resolve()
      })
    })
  }
}
