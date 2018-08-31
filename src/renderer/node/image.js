const gm = require('gm').subClass({
  imageMagick: true,
  appPath: '/usr/local/bin/'
})

const replaceExt = (str, ext) => str.replace(/(\.[a-z0-9]+)?$/i, `.${ext}`)
const [
  BEGIN,
  CENTER,
  END
] = [
  () => 0,
  // size, resized
  (s, r) => Math.max(0, (r - s) / 2),
  (s, r) => Math.max(0, r - s)
]

const CROP_CALCULATOR = {
  WIDTH: {
    L: BEGIN,
    C: CENTER,
    R: END
  },

  HEIGHT: {
    T: BEGIN,
    C: CENTER,
    B: END
  }
}

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
    const {q, ext} = this

    output = replaceExt(output, ext)
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

      // If h is unset -> fit must be WIDTH or NONE -> then calculate h
      h = h || oh * w / ow
      w = w || ow * h / oh

      // The image size after resizing
      let rw = ow
      let rh = oh

      switch (fit) {
        case 'WIDTH':
          rw = w
          rh = oh * w / ow
          this.resize(rw, rh)
          break

        case 'HEIGHT':
          rw = ow * h / oh
          rh = h
          this.resize(rw, rh)
          break

        case 'BOTH':
          rw = w
          rh = h
          // Force fitting which might causes streching
          this.resize(rw, rh, '!')
          break
      }

      if (ch && cv) {
        const x = CROP_CALCULATOR.WIDTH[ch](w, rw)
        const y = CROP_CALCULATOR.HEIGHT[cv](h, rh)

        this.crop(w, h, x, y)
      }

      if (q) {
        this.quality(q)
      }

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
