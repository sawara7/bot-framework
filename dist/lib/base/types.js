"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseBotStatus = exports.getDefaultTicker = exports.botCurrencyList = void 0;
exports.botCurrencyList = [
    'JPY',
    'USD'
];
function getDefaultTicker() {
    return {
        ask: 0,
        bid: 0
    };
}
exports.getDefaultTicker = getDefaultTicker;
function getBaseBotStatus() {
    return {
        isClear: false,
        isStop: false,
        isExit: false
    };
}
exports.getBaseBotStatus = getBaseBotStatus;
