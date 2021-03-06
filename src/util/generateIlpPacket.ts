import { serializeIlpPrepare } from 'ilp-packet'
import { STATIC_CONDITION, STATIC_FULFILLMENT } from './constants'
const START_DATE = 1434412800000 // June 16, 2015 00:00:00 GMT
export const generateIlpPrepare = (amount: string, destination: string, expiryWindow: number) => {
  
  const prepare = {
    amount,
    destination,
    executionCondition: STATIC_CONDITION,
    expiresAt: new Date(START_DATE + expiryWindow * 1000),
    data: STATIC_FULFILLMENT
  }

  return serializeIlpPrepare(prepare)
}
