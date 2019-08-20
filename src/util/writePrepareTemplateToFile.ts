import { generateIlpPrepare } from './generateIlpPacket'
import fs from 'fs'

const packet = generateIlpPrepare('5', 'test.connector.alice', 1)

fs.writeFile("prepareTemplate.bin", packet,  "binary",function(err) { })