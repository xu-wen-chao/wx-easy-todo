const path = require('path')
const fs = require('fs')
const { src, dest, series, parallel, watch } = require('gulp')
const debug = require('gulp-debug')
const changed = require('gulp-changed')
const gulpif = require('gulp-if')
const jdists = require('gulp-jdists')
const rename = require('gulp-rename')
const gulpTs = require('gulp-typescript')
const tsProject = gulpTs.createProject('./tsconfig.json')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')

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

const axios = require('axios')
const ideConfigPath = `C:/Users/xuwenchao/AppData/Local/微信开发者工具/User Data/Default/.ide` // 微信开发工具配置文件路径
const devToolPort = fs.readFileSync(ideConfigPath, { encoding: 'utf-8' }) // 微信开发工具服务端端口,从配置文件中读取，因为每次启动开发工具都会改变
const asbDistRoot = encodeURIComponent(path.resolve(distRoot))
const request = axios.create({
  baseURL: `http://127.0.0.1:${devToolPort}`,
  timeout: 10000
})
request.interceptors.request.use(config => {
  config.params = { ...config.params, projectpath: asbDistRoot }
  return config
})

// 构建npm
const buildNpm = async () => await request.get('/buildnpm')

// 复制移动cloudfunctions下的所有文件
const cloudFns = () => src([`/**/*.*`], { root: cloudfunctionsRoot })
  .pipe(changed(cloudfunctionsDist))
  .pipe(dest(cloudfunctionsDist))

// 处理图片资源
const images = () => src(imagesPath, { root: miniprogramRoot })
  .pipe(changed(`${miniprogramDist}/images`))
  .pipe(dest(`${miniprogramDist}/images`))

// 处理样式
const style = () => src(stylePath, { ignore: ignorePath })
  .pipe(changed(miniprogramDist))
  .pipe(sass().on('error', sass.logError))
  .pipe(rename(path => (path.extname = '.wxss')))
  .pipe(dest(miniprogramDist))

// 复制移动小程序配置文件
const projectConfig = () => src('project.config.json')
  .pipe(changed(distRoot))
  .pipe(dest(distRoot))

// 仅需复制移动的文件
const copy = () => src(copyPaths, { ignore: ignorePath })
  .pipe(changed(miniprogramDist))
  .pipe(dest(miniprogramDist))

// 编译移动ts文件(这里的gulp-changed必须声明 {extension: '.js'}，因为后缀从ts变成js了，如果不声明会认为你的文件也是changed了)
const ts = () => tsProject.src()
  .pipe(changed(miniprogramDist, { extension: '.js' }))
  .pipe(jdists({ trigger: isDev ? 'dev' : 'prod' }))
  .pipe(tsProject())
  .pipe(dest(miniprogramDist))

// 复制移动生产环境需要的node_modules
const nodeModules = () => src(miniprogramNodeModulesPath)
  .pipe(changed(miniprogramNodeModulesDist))
  .pipe(dest(miniprogramNodeModulesDist))

// 复制完node_modules后，构建小程序npm
const npm = series(nodeModules, buildNpm)

const watchFiles = () => {
  watch(imagesPath, images)
  watch(stylePath, { ignored: ignorePath }, style)
  watch(tsPath, { ignored: ignorePath }, ts)
  watch(copyPaths, { ignored: ignorePath }, copy)
  watch(miniprogramNodeModulesPath, npm)
}

const tasks = series(parallel(ts, copy, style, projectConfig, cloudFns, images), npm)

exports.npm = npm
exports.build = tasks
exports.dev = series(tasks, watchFiles)