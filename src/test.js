import http from "k6/http"
import { Counter } from 'k6/metrics'
import { modifyAmount, modifyDestination, modifyExpiry } from './modules/ilp-packet-modifier.js'

let prepareTemplate = open("./prepareTemplate.bin", "b")
const fulfillCounter = new Counter("fulfills")
const rejectCounter = new Counter("rejects")
const unknownResponseCounter = new Counter("unknown response")

export default function() {
  // console.log('VU_id', __VU, 'iter', __ITER)

  modifyAmount(prepareTemplate, 3)

  modifyExpiry(prepareTemplate, new Date(Date.now() + 10 * 1000))

  modifyDestination(prepareTemplate, 'test.connector.' + __VU)

  const response = http.post("http://localhost:3000/packet", test[0], { headers: { 'Content-Type': 'application/octet-stream' }, responseType: 'binary' })

  if (response.body[0] === 13) {
    fulfillCounter.add(1)
  }
  else if (response.body[0] === 14) {
    rejectCounter.add(1)
  }
  else {
    unknownResponseCounter.add(1)
  }
}
