"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGO_PATH_POSITIONS = void 0;
exports.getDefaultMultiPositionStatistics = getDefaultMultiPositionStatistics;
exports.getDefaultSendOpenOrderResult = getDefaultSendOpenOrderResult;
exports.getDefaultSendCloseOrderResult = getDefaultSendCloseOrderResult;
exports.MONGO_PATH_POSITIONS = 'positions';
function getDefaultMultiPositionStatistics() {
    return {
        unrealized: 0,
        buySize: 0,
        buyPositionNum: 0,
        sellSize: 0,
        sellPositionNum: 0,
        buyAveragePrice: 0,
        sellAveragePrice: 0
    };
}
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
