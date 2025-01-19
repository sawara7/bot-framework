"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultSendOpenOrderResult = getDefaultSendOpenOrderResult;
exports.getDefaultSendCloseOrderResult = getDefaultSendCloseOrderResult;
function getDefaultSendOpenOrderResult() {
    return {
        success: false,
        orderID: '',
        orderType: 'limit'
    };
}
function getDefaultSendCloseOrderResult() {
    return {
        success: false,
        orderID: '',
        orderType: 'limit'
    };
}
