import {isArray} from 'core-util-is'
import fse from 'fs-extra'
import path from 'path'
import pLimit from 'p-limit'
import glob from 'glob'

import Image from './image'
import { callbackify } from 'util';

const limit = pLimit(30)

const CROPPER_DIVIDER = '__'
const CROPPER_JOINER = '_'
const KEYS = ['w', 'h', 'fit', 'crop', 'q']
const DEFAULT_EXT = 'jpg'
const stringifyValue = v => v
  ? isArray(v)
    ? v.map(v => v || '').join('') || 'NONE'
    : v
  : 'NONE'

const stringify = options =>
  KEYS.map(key => `${key}${stringifyValue(options[key])}`).join(CROPPER_JOINER)

const getOutput = (src, options) => {
  const original_ext = path.extname(src)
  const basenames = path.basename(src, original_ext).split(CROPPER_DIVIDER)
  const dirname = path.dirname(src)

  if (basenames.length > 1) {
    basenames.pop()
  }

  const basename = basenames.join(CROPPER_DIVIDER)
  return path.join(
    dirname,
    `${basename}${CROPPER_DIVIDER}${stringify(options)}`
  )
}


// const convertOne = console.log
const convertOne = (file, output, options) => limit(
  () => new Image(file)
  .size(options)
  .quality(options.q)
  .format(options.ext)
  .write(output)
)

const convertFile = (file, options) => {
  const output = getOutput(file, options)
  return convertOne(file, output, options)
}

const isFile = f => !/\/$/.test(f)
const globby = (pattern, options) => new Promise((resolve, reject) => {
  glob(pattern, options, (err, files) => {
    if (err) {
      return reject(err)
    }

    resolve(files)
  })
})

const convertDir = async (dir, options, onProgress) => {
  const output_dir = getOutput(dir, options)
  const globbed = await globby('**/*', {
    cwd: dir,
    mark: true
  })

  const dirs = [output_dir]
  const files = globbed.filter(f => {
    const is = isFile(f)
    if (!is) {
      dirs.push(path.join(output_dir, f))
    }

    return is
  })

  await Promise.all(dirs.map(d => fse.ensureDir(d)))

  return convertFiles(files, dir, output_dir, options, onProgress)
}

const convertFiles = (files, from, to, options, onProgress) => {
  const total = files.length
  let count = 0

  const tasks = files.map(f => {
    const src = path.join(from, f)
    const output = path.join(to, f)
    return convertOne(src, output, options)
    .then(() => {
      count ++
      onProgress(count, total)
    })
  })

  return Promise.all(tasks)
}

const createConvertTask = async (p, options, onProgress) => {
  const stat = await fse.stat(p)

  if (stat.isFile()) {
    return convertFile(p, options)
  }

  if (stat.isDirectory()) {
    return convertDir(p, options, onProgress)
  }

  throw new Error('only files and dirs are supported!')
}

export const convert = (paths, options, onProgress) => {
  const tasks = paths.map(p => createConvertTask(p, options, onProgress))
  return Promise.all(tasks)
}
