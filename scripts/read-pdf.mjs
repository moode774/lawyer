import { readFileSync } from 'fs'
import { PDFParse } from 'pdf-parse'
const parser = new PDFParse({ data: new Uint8Array(readFileSync(process.argv[2])) })
const res = await parser.getText()
console.log(res.text)
await parser.destroy()
