// Width and height
// - fit
//   - width
//     crop: top or buttom
//   - height
//     crop: left or right
//   - both
//   - none

// import {isArray} from 'core-util-is'
// const EE = require('events')

// const isUnset = v => v === null || v === undefined
const isNumeric = v => !Number.isNaN(parseInt(v, 10))

// const setInteger = name => v => {
//   if (isUnset(v)) {
//     return null
//   }

//   if (isNumeric(v)) {
//     throw new TypeError(`${name} is not a number, but got ${v}`)
//   }

//   v = parseInt(v, 10)
//   if (v === 0) {
//     throw new TypeError(`${name} should not be 0`)
//   }

//   return v
// }

const FIT_OPTIONS_DEF = {
  // crop: all
  NONE: {
    desc: '不缩放',
    condition (w, h) {
      return isNumeric(w) || isNumeric(h)
    }
  },

  //
  WIDTH: {
    desc: '仅缩放宽度',
    condition (w) {
      return isNumeric(w)
    }
  },

  HEIGHT: {
    desc: '仅缩放高度',
    condition (_, h) {
      return isNumeric(h)
    }
  },

  WIDTH_HEIGHT: {
    desc: '同时缩放宽高',
    condition (w, h) {
      return isNumeric(w) && isNumeric(h)
    }
  }
}

const FIT_OPTIONS = Object.keys(FIT_OPTIONS_DEF)

export const getFitDesc = v => FIT_OPTIONS_DEF[v].desc

export const fitOptions = () => {
  const ret = {}
  FIT_OPTIONS.forEach(value => {
    ret[value] = {
      desc: getFitDesc(value),
      disabled: false,
      value
    }
  })

  return ret
}

export const checkFit = (v, w, h) => FIT_OPTIONS_DEF[v].condition(w, h)

export const checkFitOptions = (options, w, h) => {
  const available = []

  FIT_OPTIONS.forEach(v => {
    const valid = checkFit(v, w, h)
    options[v].disabled = !valid

    if (valid) {
      available.push(v)
    }
  })

  return available
}

// const [
//   L,
//   R,
//   T,
//   B,
//   C
// ] = [
//   'LEFT',
//   'RIGHT',
//   'TOP',
//   'BOTTOM',
//   'CENTER'
// ]

// const CROP_OPTIONS = [
//   [L, T], [C, T], [R, T],
//   [L, C], [C, C], [R, C],
//   [L, B], [C, B], [R, B]
// ]

// const checkCrop = ([ch, cv], fit) => fit === 'NONE'
// ? true
// : fit === 'WIDTH_HEIGHT'
//   ? ch === null && cv === null
//     ? true
//     : false
//   : fit === 'WIDTH'
//     ? ch === C
//     : cv === C

// const FIT_TYPES = {
//   WIDTH: true,
//   HEIGHT: true
// }

// const checkFitType = v => {
//   if (v === null) {
//     return
//   }

//   if (v in FIT_TYPES) {
//     return
//   }

//   throw new TypeError(`invalid fit type ${v}`)
// }

// const Skema = shape({
//   width: {
//     default: 100,
//     set: setInteger('width')
//   },

//   height: {
//     default: 100,
//     set: setInteger('height')
//   },

//   fit: {
//     set (v) {
//       if (isArray(v)) {
//         throw new TypeError(`fit must be an array, but got ${v}`)
//       }

//       const [a = null, b = null] = v
//       checkFitType(a)
//       checkFitType(b)

//       if (a === b && a !== null) {
//         throw new TypeError(`fit types should not be both "${a}"`)
//       }

//       const ret = a === 'HEIGHT' || b === 'WIDTH'
//         ? [b, a]
//         : [a, b]

//       return ret
//     }
//   },

//   crop: {
//     set (v) {
//       if (isArray(v)) {
//         throw new TypeError(`crop must be an array, but got ${v}`)
//       }

//       const [a, b] = v
//       const ta = getCropType(a)
//       const tb = getCropType(b)
//       const is_equal= ta === tb

//       if (is_equal && ta !== BOTH) {
//         throw new TypeError(
//           `crop types should not be both vertical or horizontal`
//         )
//       }

//       if (is_equal && ta === BOTH) {
//         return v
//       }

//       const ret = ta === HORIZONTAL
//         // left, top
//         ? v
//         : ta === VERTICAL
//           // top, left -> left top
//           ? [b, a]
//           : tb === HORIZONTAL
//             // center, left -> left, center
//             ? [b, a]
//             // center, center -> center, center
//             // center, top -> center, top
//             : v

//       const {
//         width,
//         height,
//         fit
//       } = this.parent

//       checkCrop(ret, width, height, fit)

//       return ret
//     }
//   }
// })

// class Properties extends EE {
//   constructor ({
//     w,
//     h,
//     fit,
//     crop
//   }) {
//     super()

//     this._w = w
//     this._h = h
//     this._fit = fit
//     this._crop = crop
//   }

//   get w () {
//     return this._w
//   }

//   get h () {
//     return this._h
//   }

//   get fit () {
//     return this._fit
//   }

//   get crop () {
//     return this._crop
//   }

//   set w (w) {
//     this._w = w

//   }

//   _checkFit () {

//   }

//   _check () {
//     const old_fit = this._fit
//     const old_crop = this._crop


//   }
// }
