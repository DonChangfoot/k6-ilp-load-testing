import Koa from 'koa'
import { deserializeIlpPrepare } from 'ilp-packet'
const getRawBody = require('raw-body')
const PORT = process.env.PORT || 3000

const app = new Koa()
app.use(async ctx => {
  if (ctx.path === '/ilp') {
    const payload = await getRawBody(ctx.req)
    const deserializedPacket = deserializeIlpPrepare(payload)
    console.log('packet', deserializedPacket)
    ctx.set('content-type', 'application/octet-stream')
    ctx.body = payload
  } else {
    ctx.body = 'ok'
  }
})

app.listen(PORT,() => console.log('listening on port ' + PORT))
