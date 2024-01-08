"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseBotResult = exports.getBaseBotStatus = exports.getDefaultTicker = exports.botCurrencyList = exports.MONGO_PATH_BOTRESULT = exports.MONGO_PATH_BOTSTATUS = void 0;
exports.MONGO_PATH_BOTSTATUS = 'botStatus';
exports.MONGO_PATH_BOTRESULT = 'botResult';
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
        isExit: false,
        message: '-'
    };
}
exports.getBaseBotStatus = getBaseBotStatus;
function getBaseBotResult() {
    return {
        botName: '',
        logicName: '',
        updateTimestamp: new Date().toLocaleString(),
        cumulativeProfit: 0,
        currentBadget: 0,
        initialBadget: 0,
        ticker: getDefaultTicker()
    };
}
exports.getBaseBotResult = getBaseBotResult;
