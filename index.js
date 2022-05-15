#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises'
import { emitKeypressEvents } from 'readline'

const { parse, stringify } = JSON
const { ceil, floor, random } = Math

const chars = 'abcdefghijklmnopqrstuvwxyz'
const filename = 'data.json'
const frequency = 5000

const tryCatch = fn => {
  try {
    return fn()
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
    process.exit(0)
  }
}

const multiply = n => ceil(random() * n) * ceil(random() * n)

const array = len => Array.from(Array(multiply(len)))

const word = len => array(len)
  .map(() => chars[floor(random() * chars.length) - 1])
  .join('')

const sentence = len => array(len)
  .map(() => word(multiply(len)))
  .join(', ')

const getter = () => tryCatch(async () => parse((await readFile(filename)).toString()))

const setter = async (wLen = 4, sLen = 4) => tryCatch(async () =>
  await writeFile(filename, stringify({
    ...await getter(),
    [word(wLen)]: sentence(sLen)
  }))
)

const draw = async () => {
  const data = await getter()
  console.clear()
  console.log(data)
  console.log(`
    \r=======================
    \rfile: ${filename}
    \ritems: ${Object.keys(data).length}
    \rlast updated: ${new Date().toLocaleString()}
    \rupdate frequency: ${frequency}ms

    \r=======================
    \rpress [any key] to exit
  `)
}

const interval = setInterval(async () => tryCatch(async () => {
  await setter()
    draw()
  }), frequency)

process.stdin.setRawMode(true)
process.stdin.on('keypress', () => process.exit(0))

emitKeypressEvents(process.stdin)

draw()
