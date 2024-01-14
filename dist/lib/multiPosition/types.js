"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultSendCloseOrderResult = exports.getDefaultSendOpenOrderResult = exports.getDefaultMultiPositionStatistics = exports.MONGO_PATH_POSITIONS = void 0;
exports.MONGO_PATH_POSITIONS = 'Positions';
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
exports.getDefaultMultiPositionStatistics = getDefaultMultiPositionStatistics;
function getDefaultSendOpenOrderResult() {
    return {
        success: false,
        orderID: '',
        orderType: 'limit'
    };
}
exports.getDefaultSendOpenOrderResult = getDefaultSendOpenOrderResult;
function getDefaultSendCloseOrderResult() {
    return {
        success: false,
        orderID: '',
        orderType: 'limit'
    };
}
exports.getDefaultSendCloseOrderResult = getDefaultSendCloseOrderResult;
