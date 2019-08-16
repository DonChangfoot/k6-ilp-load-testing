import http from "k6/http"
import { modifyAmount, modifyDestination, modifyExpiry } from './modules/ilp-packet-modifier.js'

let prepareTemplate = open("./prepareTemplate.bin", "b")

export default function() {
  console.log('VU_id', __VU, 'iter', __ITER)

  modifyAmount(prepareTemplate, 3)

  modifyExpiry(prepareTemplate, new Date(Date.now() + 10 * 1000))

  modifyDestination(prepareTemplate, 'test.connector.' + __VU)
  
  const response = http.post("http://localhost:3000/packet", prepareTemplate, { headers: { 'Content-Type': 'application/octet-stream' }, responseType: 'binary' })
}
