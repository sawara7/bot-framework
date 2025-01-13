"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGODB_TABLE_CUMULATIVEPL = exports.MONGODB_TABLE_STATISTICS = exports.MONGODB_TABLE_TICKER = exports.MONGODB_TABLE_BOTRESULT = exports.MONGODB_TABLE_BOTSTATUS = exports.MONGODB_DB_BOTSTATUS = void 0;
exports.getBaseBotStatus = getBaseBotStatus;
exports.getBaseBotResult = getBaseBotResult;
exports.getTickerPath = getTickerPath;
const utils_trade_1 = require("utils-trade");
exports.MONGODB_DB_BOTSTATUS = 'botStatus';
exports.MONGODB_TABLE_BOTSTATUS = 'status';
exports.MONGODB_TABLE_BOTRESULT = 'result';
exports.MONGODB_TABLE_TICKER = 'ticker';
exports.MONGODB_TABLE_STATISTICS = 'statistics';
exports.MONGODB_TABLE_CUMULATIVEPL = 'cumulativePL';
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
function getTickerPath(key) {
    return exports.MONGODB_TABLE_TICKER + '-' + key;
}
