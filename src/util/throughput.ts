import { createInterface } from 'readline'
import fs from 'fs'

const JSON_RESULTS_PATH = process.env.JSON_RESULTS_PATH || ''
const THROUGHPUT_OUTPUT_PATH = process.env.THROUGHPUT_OUTPUT_PATH || './throughput.json'

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
  const throughput = { max: 1/min, min: 1/max, avg: 1/avg }

  fs.writeFile(THROUGHPUT_OUTPUT_PATH, throughput, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved." + THROUGHPUT_OUTPUT_PATH);
});


  console.log('throughput (reqs/s):', throughput)
})