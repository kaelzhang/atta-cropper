'use strict'

module.exports = convert

const Image = require('./image')
const expand = require('fs-expand')
const fse = require('fs-extra')
const node_path = require('path')
const fs = require('fs')
const async = require('async')


function convert (things, size, callback) {
  async.each(things, (something, done) => {
    convert_one(something, size, done)
  }, callback)
}


function convert_one (something, size, callback) {
  fs.stat(something, (err, stat) => {
    if (err) {
      return callback(err)
    }

    if (stat.isFile()) {
      convert_file(something, size, callback)
      return
    }

    if (stat.isDirectory()) {
      convert_dir(something, size, callback)
      return
    }

    callback(new Error('only files and dirs are supported!'))
  })
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
    done = once(done)
    new Image(src).size(size).write(dest, done)

  }, callback)
}
