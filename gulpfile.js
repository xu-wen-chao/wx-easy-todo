const path = require('path')
const fs = require('fs')
const { src, dest, series, parallel, watch } = require('gulp')
const debug = require('gulp-debug')
const changed = require('gulp-changed')
const gulpif = require('gulp-if')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')

const ideConfigPath = `C:/Users/xuwenchao/AppData/Local/微信开发者工具/User Data/Default/.ide` // 微信开发工具配置文件路径
const devToolPort = fs.readFileSync(ideConfigPath, { encoding: 'utf-8' }) // 微信开发工具服务端端口,从配置文件中读取，因为每次启动开发工具都会改变\
const requestUrl = `http://127.0.0.1:${devToolPort}`
const distRoot = 'dist'
const miniprogramRoot = 'miniprogram'
const cloudfunctionsRoot = 'cloudfunctions'
const miniprogramDist = `${distRoot}/miniprogram`
const cloudfunctionsDist = `${distRoot}/cloudfunctions`
const stylePath = `${miniprogramRoot}/**/*.{wxss,scss}`
const wxmlPath = `${miniprogramRoot}/**/*.wxml`
const imagesPath = `${miniprogramRoot}/images/**/*.*`
const nodeModulesPath = 'node_modules'
const isDev = process.env.NODE_ENV === 'development' // 是否是开发环境
const ignorePath = `${miniprogramRoot}/${nodeModulesPath}/**/*.*`


// 复制移动wxss
const wxml = () => src(wxmlPath, { ignore: ignorePath })
  .pipe(gulpif(isDev, changed(miniprogramDist)))
  .pipe(dest(miniprogramDist))

// 复制移动cloudfunctions下的所有文件
const cloudFns = () => src([`/**/*.*`], { root: cloudfunctionsRoot })
  .pipe(gulpif(isDev, changed(cloudfunctionsDist)))
  .pipe(dest(cloudfunctionsDist))

// 处理图片资源
const images = () => src(imagesPath, { root: miniprogramRoot })
  .pipe(gulpif(isDev, changed(`${miniprogramDist}/images`)))
  .pipe(dest(`${miniprogramDist}/images`))

// 处理样式
const style = () => src(stylePath, { ignore: ignorePath })
  .pipe(gulpif(isDev, changed(miniprogramDist)))
  // .pipe(debug({title: 'F'}))
  .pipe(sass().on('error', sass.logError))
  .pipe(rename(path => (path.extname = '.wxss')))
  .pipe(dest(miniprogramDist))

const projectConfig = () => src('project.config.json')
  .pipe(gulpif(isDev, changed(distRoot)))
  .pipe(dest(distRoot))

const watchFiles = () => {
  watch(`${imagesPath}`, images)
  watch(`${stylePath}`, { ignored: ignorePath }, style)
}

const tasks = parallel(wxml, style, cloudFns, projectConfig, images)

exports.wxml = wxml
exports.cloudFns = cloudFns
exports.build = tasks
exports.dev = series(tasks, watchFiles)