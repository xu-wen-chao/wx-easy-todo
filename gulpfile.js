const path = require('path')
const fs = require('fs')
const { src, dest, series, parallel, watch } = require('gulp')
const debug = require('gulp-debug')
const changed = require('gulp-changed')
const gulpif = require('gulp-if')
const rename = require('gulp-rename')
const gulpTs = require('gulp-typescript')
const tsProject = gulpTs.createProject('./tsconfig.json')
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
const tsPath = `${miniprogramRoot}/**/*.ts`
const imagesPath = `${miniprogramRoot}/images/**/*.*`
const nodeModulesPath = 'node_modules'
const isDev = process.env.NODE_ENV === 'development' // 是否是开发环境
const ignorePath = `**/${nodeModulesPath}/**/*.*`
const miniprogramNodeModulesPath = `${miniprogramRoot}/${nodeModulesPath}/**/*.*`
const miniprogramNodeModulesDist = `${miniprogramDist}/${nodeModulesPath}`
const copyPaths = [
  `${miniprogramRoot}/**/*.*`,
  `!${tsPath}`,
  `!${stylePath}`,
  `!${imagesPath}`
]

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
  .pipe(sass().on('error', sass.logError))
  .pipe(rename(path => (path.extname = '.wxss')))
  .pipe(dest(miniprogramDist))

// 复制移动小程序配置文件
const projectConfig = () => src('project.config.json')
  .pipe(gulpif(isDev, changed(distRoot)))
  .pipe(dest(distRoot))

// 仅需复制移动的文件
const copy = () => src(copyPaths, { ignore: ignorePath })
  .pipe(gulpif(isDev, changed(miniprogramDist)))
  .pipe(dest(miniprogramDist))

// 编译移动ts文件(这里的gulp-changed必须声明 {extension: '.js'}，因为后缀从ts变成js了，如果不声明会认为你的文件也是changed了)
const ts = () => tsProject.src()
  .pipe(gulpif(isDev, changed(miniprogramDist, { extension: '.js' })))
  // .pipe(debug({ title: 'T' }))
  .pipe(tsProject())
  .pipe(dest(miniprogramDist))

// 复制移动生产环境需要的node_modules
const nodeModules = () => src(miniprogramNodeModulesPath)
  .pipe(gulpif(isDev, changed(miniprogramNodeModulesDist)))
  .pipe(dest(miniprogramNodeModulesDist))

const watchFiles = () => {
  watch(imagesPath, images)
  watch(stylePath, { ignored: ignorePath }, style)
  watch(tsPath, { ignored: ignorePath }, ts)
  watch(copyPaths, { ignored: ignorePath }, copy)
  watch(miniprogramNodeModulesPath, nodeModules)
}

const tasks = parallel(nodeModules, copy, ts, style, projectConfig, cloudFns, images)

exports.build = tasks
exports.dev = series(tasks, watchFiles)