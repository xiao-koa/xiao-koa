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
