import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport:{width:430,height:880} })
const errs = []
p.on('console', m => { if (m.type()==='error') errs.push('CONSOLE: '+m.text()) })
p.on('pageerror', e => errs.push('PAGEERROR: '+e.message))
await p.goto('http://localhost:5173/', { waitUntil:'networkidle' })
await p.waitForTimeout(600)
const rootHtml = await p.$eval('#root', el => el.innerHTML.length)
console.log('root innerHTML length:', rootHtml)
console.log('errors:', errs.length ? errs.join('\n') : 'none')
await b.close()
