"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGO_PATH_BOTSTATISTICS = exports.MONGO_PATH_BOTRESULT = exports.MONGO_PATH_BOTSTATUS = void 0;
exports.getBaseBotStatus = getBaseBotStatus;
exports.getBaseBotResult = getBaseBotResult;
const utils_trade_1 = require("utils-trade");
exports.MONGO_PATH_BOTSTATUS = 'botStatus';
exports.MONGO_PATH_BOTRESULT = 'botResult';
exports.MONGO_PATH_BOTSTATISTICS = 'botStatistics';
function getBaseBotStatus() {
    return {
        botName: '',
        isClear: false,
        isStop: false,
        isExit: false,
        message: '-',
        startDate: Date.now()
    };
}
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
