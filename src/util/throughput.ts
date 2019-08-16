import { createInterface } from 'readline'
import fs from 'fs'

const JSON_RESULTS_PATH = process.env.JSON_RESULTS_PATH || ''

type K6ResultEntry = { 
  type: 'Metric' | 'Point'
  data: { [k: string]: any }
  metric: string
  [k: string]: any
 }

const readInterface = createInterface({
  input: fs.createReadStream(JSON_RESULTS_PATH)
});

const data: K6ResultEntry[] = []

readInterface.on('line', function(line) {
  data.push(JSON.parse(line))
});

readInterface.on('close', function () {
  const http_req_durations = data.filter((line: K6ResultEntry) => {
    return line.type === 'Point' && line.metric === 'http_req_duration'
  }).map((line: K6ResultEntry) => line.data.value) // durations in ms
  const min = Math.min(...http_req_durations)/1000
  const max = Math.max(...http_req_durations)/1000
  const avg = http_req_durations.reduce((prev: number, curr: number) => prev + curr, 0)/(http_req_durations.length * 1000)

  console.log('throughput (reqs/s):', { min: 1/min, max: 1/max, avg: 1/avg })
})