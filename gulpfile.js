const path = require('path')
const fs = require('fs')
const { src, dest, series, parallel, watch } = require('gulp')
const debug = require('gulp-debug')
const changed = require('gulp-changed')
const jdists = require('gulp-jdists')
const rename = require('gulp-rename')
const gulpTs = require('gulp-typescript')
const replace = require('gulp-replace')
const tsProject = gulpTs.createProject('./tsconfig.json', {
  typescript: require('ttypescript')
})
const projectConfig = require('./project.config.json')
const sass = require('gulp-sass')
const glob = require('glob')
const ci = require('miniprogram-ci')
sass.compiler = require('node-sass')
const distRoot = 'dist'
const miniprogramRoot = 'miniprogram'
const cloudfunctionsRoot = 'cloudfunctions'
const miniprogramDist = `${distRoot}/miniprogram`
const stylePath = `${miniprogramRoot}/**/*.scss`
const tsPath = `${miniprogramRoot}/**/*.ts`
const nodeModulesPath = 'node_modules'
const isDev = process.env.NODE_ENV === 'development' // 是否是开发环境
const ignorePath = `./${nodeModulesPath}/**/*.*`
const copyPaths = [
  `./+(${miniprogramRoot}|${cloudfunctionsRoot})/**/*.*`,
  'project.config.json',
  `!${tsPath}`,
  `!${stylePath}`
]
const project = new ci.Project({
  appid: projectConfig.appid,
  type: 'miniProgram',
  projectPath: path.resolve(distRoot),
  privateKeyPath: glob.sync('./private.*.key')[0],
  ignores: ['node_modules/**/*']
})

// 构建npm
const buildNpm = async () => {
  const warning = await ci.packNpm(project, {
    reporter: (infos) => {
      console.log(infos)
    }
  })
  console.warn(warning)
}

// 处理样式
const style = () =>
  src(stylePath, { ignore: ignorePath })
    .pipe(changed(miniprogramDist))
    .pipe(sass().on('error', sass.logError))
    .pipe(replace(/\/\*\s*(@import\s\S+)\s*\*\//g, ($1, $2) => $2))
    .pipe(rename((path) => (path.extname = '.wxss')))
    .pipe(dest(miniprogramDist))

// 仅需复制移动的文件
const copy = () =>
  src(copyPaths, { ignore: ignorePath })
    .pipe(changed(distRoot))
    .pipe(replace('APP_ID', projectConfig.appid))
    .pipe(replace('APP_SECRET', projectConfig.appSecret))
    .pipe(dest(distRoot))

// 编译移动ts文件(这里的gulp-changed必须声明 {extension: '.js'}，因为后缀从ts变成js了，如果不声明会认为你的文件也是changed了)
const ts = () =>
  tsProject
    .src()
    .pipe(changed(miniprogramDist, { extension: '.js' }))
    .pipe(jdists({ trigger: isDev ? 'dev' : 'prod' }))
    .pipe(tsProject())
    .pipe(dest(miniprogramDist))

const watchFiles = () => {
  watch(stylePath, { ignored: ignorePath }, style)
  watch(tsPath, { ignored: ignorePath }, ts)
  watch(copyPaths, { ignored: ignorePath }, copy)
}

const tasks = series(copy, buildNpm, parallel(ts, style))

exports.npm = buildNpm
exports.build = tasks
exports.dev = series(tasks, watchFiles)
