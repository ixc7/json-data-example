#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises'
import { emitKeypressEvents } from 'readline'

const chars = 'abcdefghijklmnopqrstuvwxyz'
const filename = 'data.json'

const multiply = n => Math.ceil(Math.random() * n) * Math.ceil(Math.random() * n)

const randomIndex = () => Math.floor(Math.random() * chars.length) - 1

const randomString = len => {
  return Array.from(Array(multiply(len)))
    .map(() => chars[randomIndex()])
    .join('')
}

const randomStrings = len => {
  return Array.from(Array(multiply(len)))
    .map(() => randomString(multiply(len)))
    .join(', ')
}

const getData = async () => JSON.parse((await readFile('data.json')).toString())

const setData = async (k = 4, v = 4) => {
  try {
    await writeFile(filename, JSON.stringify({
      ...await getData(),
      [randomString(k)]: randomStrings(v)
    }))
  }
  catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
}

const draw = async () => {
  const data = await getData()
  console.clear()
  console.log(data)
  console.log(`
    \r=======================
    \rfile: ${filename}
    \ritems: ${Object.keys(data).length}
    \rlast updated: ${new Date().toLocaleString()}

    \r=======================
    \rpress [any key] to exit
  `)
}

const interval = setInterval(async () => {
  try {
    await setData()
    draw()
  }
  catch (e) {
    console.log(`${e.name}: ${e.message}`)
    process.exit(0)
  }
}, 7500)

process.stdin.setRawMode(true)
process.stdin.on('keypress', () => process.exit(0))

emitKeypressEvents(process.stdin)

draw()
