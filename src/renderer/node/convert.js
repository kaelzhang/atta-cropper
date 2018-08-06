import Image from './image'
import fse from 'fs-extra'
import path from 'path'
import fs from 'fs'
import pLimit from 'p-limit'

const limit = pLimit(30)

export const convert = (paths, options) => {
  const tasks = paths.map(p => convertOne(p, options))
  return Promise.all(tasks)
}


const convertOne = async (p, options) => {
  const stat = await fs.stat(p)

  if (stat.isFile()) {
    return convertFile(p, options)
  }

  if (stat.isDirectory()) {
    return convertDir(p, options)
  }

  throw new Error('only files and dirs are supported!')
}

const REGEX_REPLACE_EXT = /\.[a-z0-9]+$/

function convert_file (file, size, callback) {
  let output_file = file.replace(REGEX_REPLACE_EXT, (m) => {
    return `-${size}x${size}${m}`
  })

  new Image(file).size(size).write(output_file, callback)
}


function convert_dir (dir, size, callback) {
  let output = `${dir}-${size}x${size}`
  let files

  async.parallel([
    (done) => {
      expand('**/*', {
        cwd: dir,
        filter: 'isFile'

      }, (err, _files) => {
        if (err) {
          return done(err)
        }

        files = _files
        done(null)
      })
    },

    (done) => {
      fse.ensureDir(output, done)
    }

  ], (err) => {
    if (err) {
      return callback(err)
    }

    convert_files(files, dir, output, size, callback)
  })
}


function convert_files (files, source_dir, output_dir, size, callback) {
  async.each(files, (file, done) => {
    let src = node_path.join(source_dir, file)
    let dest = node_path.join(output_dir, file)
    // done = once(done)
    new Image(src).size(size).write(dest, done)

  }, callback)
}
