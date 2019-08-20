import http from "k6/http"
import { Counter } from 'k6/metrics'
import { modifyAmount, modifyDestination, modifyExpiry } from './modules/ilp-packet-modifier.js'

const CONNECTOR_ILP_ENDPOINT = __ENV.CONNECTOR_ILP_ENDPOINT || "http://localhost:3000/"
const MIN_AMOUNT = 1
const MAX_AMOUNT = 100
const EXPIRY_WINDOW = 10

let prepareTemplate = open("./prepareTemplate.bin", "b")
const fulfillCounter = new Counter("fulfills")
const rejectCounter = new Counter("rejects")
const unknownResponseCounter = new Counter("unknown response")

export default function() {
  // console.log('VU_id', __VU, 'iter', __ITER)

  const amount = Math.floor(Math.random() * (MAX_AMOUNT - MIN_AMOUNT)) + MIN_AMOUNT
  modifyAmount(prepareTemplate, amount)

  modifyExpiry(prepareTemplate, new Date(Date.now() + EXPIRY_WINDOW * 1000))

  modifyDestination(prepareTemplate, 'test.connector.' + __VU)

  const response = http.post(CONNECTOR_ILP_ENDPOINT, prepareTemplate, { headers: { 'Content-Type': 'application/octet-stream', 'Authorization': 'Bearer ' + __VU }, responseType: 'binary' })

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
