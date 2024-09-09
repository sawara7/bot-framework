"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitializedTickerStatistics = getInitializedTickerStatistics;
function getInitializedTickerStatistics() {
    return {
        ask: 0,
        bid: 0,
        currency: 'USD',
        exchange: '',
        pair: '',
        timeStamp: 0,
        average: [],
        correlation: [],
        slope: [],
        stdv: [],
        sampleSize: []
    };
}
