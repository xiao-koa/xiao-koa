import fs from 'fs'
import path from 'path'

export const getFileList = (dir: string, projectFile: string[]) => {
  const stat = fs.statSync(dir)
  if (stat.isDirectory()) {
    const dirs = fs.readdirSync(dir)
    dirs.forEach((value) => {
      getFileList(path.join(dir, value), projectFile)
    })
  } else if (stat.isFile()) {
    if (path.extname(dir) !== '.ts' && path.extname(dir) !== '.js') {
      return
    } else {
      projectFile.push(dir)
    }
  }
}

export const firstToLowerCase = (name: string) => {
  return name.replace(name[0], name[0].toLowerCase())
}

// 获得调用者的路径
export const getCallerPath = (): string => {
  const stack = new Error().stack?.split('\n') || []
  const callerLine = stack[3] || ''
  const match = callerLine.match(/\((.+):\d+:\d+\)/)
  return match ? String(match[1]) : ''  // 确保返回string类型
}
