"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseBotResult = exports.getBaseBotStatus = exports.botCurrencyList = exports.MONGO_PATH_BOTRESULT = exports.MONGO_PATH_BOTSTATUS = void 0;
const utils_trade_1 = require("utils-trade");
exports.MONGO_PATH_BOTSTATUS = 'botStatus';
exports.MONGO_PATH_BOTRESULT = 'botResult';
exports.botCurrencyList = [
    'JPY',
    'USD'
];
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
        ticker: (0, utils_trade_1.getDefaultTicker)()
    };
}
exports.getBaseBotResult = getBaseBotResult;
