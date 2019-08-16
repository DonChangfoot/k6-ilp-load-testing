"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AMOUNT_BYTE_OFFSET = 2;
const EXPIRY_BYTE_OFFSET = AMOUNT_BYTE_OFFSET + (64 / 8);
const CONDITION_BYTE_OFFSET = EXPIRY_BYTE_OFFSET + 17;
const DESTINATION_OFFSET = CONDITION_BYTE_OFFSET + (256 / 8);
const INTERLEDGER_EXPIRY_LENGTH = 17;
const STATIC_ADDRESS_LENGTH = 20;
function modifyAmount(buffer, amount) {
    const amountBuffer = new ArrayBuffer(4);
    const amountView = new DataView(amountBuffer);
    amountView.setInt32(0, amount);
    for (let i = 0; i < 4; i++) {
        buffer[AMOUNT_BYTE_OFFSET + 4 + i] = amountView.getUint8(i);
    }
}
exports.modifyAmount = modifyAmount;
function modifyExpiry(buffer, expiry) {
    const interledgerExpiry = dateToInterledgerTime(expiry);
    for (let i = 0; i < INTERLEDGER_EXPIRY_LENGTH; i++) {
        buffer[EXPIRY_BYTE_OFFSET + i] = interledgerExpiry.charCodeAt(i);
    }
}
exports.modifyExpiry = modifyExpiry;
function modifyDestination(buffer, destination) {
    const paddedDestination = padRightString(destination, STATIC_ADDRESS_LENGTH);
    const destinationLengthIndicatorOffset = 1;
    for (let i = 0; i < STATIC_ADDRESS_LENGTH; i++) {
        buffer[DESTINATION_OFFSET + destinationLengthIndicatorOffset + i] = paddedDestination.charCodeAt(i);
    }
}
exports.modifyDestination = modifyDestination;
function padRightString(str, length = 20) {
    if (str.length > length) {
        throw new Error(`Cannot pad string. String length: ${str.length}. Required length: ${length}.`);
    }
    const lengthDiff = length - str.length;
    let paddedStr = str;
    for (let i = 0; i < lengthDiff; i++) {
        paddedStr += 'x';
    }
    return paddedStr;
}
function pad(n) {
    return n < 10
        ? '0' + n
        : String(n);
}
function dateToInterledgerTime(date) {
    return date.getUTCFullYear() +
        pad(date.getUTCMonth() + 1) +
        pad(date.getUTCDate()) +
        pad(date.getUTCHours()) +
        pad(date.getUTCMinutes()) +
        pad(date.getUTCSeconds()) +
        (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5);
}
exports.dateToInterledgerTime = dateToInterledgerTime;
//# sourceMappingURL=ilp-packet-modifier.js.map