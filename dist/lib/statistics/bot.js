"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickerStatisticsCustomeClass = void 0;
const bot_1 = require("../base/bot");
const utils_trade_1 = require("utils-trade");
const utils_general_1 = require("utils-general");
class TickerStatisticsCustomeClass extends bot_1.BotFrameClass {
    constructor(_params) {
        super(_params);
        this._params = _params;
    }
    initialize() {
        const _super = Object.create(null, {
            initialize: { get: () => super.initialize }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.initialize.call(this);
        });
    }
    updateTicker() {
        return __awaiter(this, void 0, void 0, function* () {
            const maxSpan = Math.max(...this._params.timeSpan);
            const timestamp = Date.now();
            const minTimestamp = timestamp - maxSpan;
            const ress = {};
            for (const k of this._params.symbols) {
                const tks = yield this.mongoDB.find((0, utils_trade_1.getTickerPath)(k), {
                    timeStamp: {
                        $gt: minTimestamp
                    }
                });
                if (tks.result && tks.data && tks.data && tks.data.length > 2) {
                    const tk = tks.data[0];
                    const res = this.updateSingleStatics((yield tks).data, this._params.timeSpan);
                    res.pair = tk.pair;
                    res.timeStamp = Date.now();
                    ress[res.pair] = res;
                    res.ask = (0, utils_general_1.floor)(tk.ask, 2);
                    res.bid = (0, utils_general_1.floor)(tk.bid, 2);
                    for (const i in res.average) {
                        res.average[i] = (0, utils_general_1.floor)(res.average[i], 2);
                    }
                    for (const i in res.correlation) {
                        res.correlation[i] = (0, utils_general_1.floor)(res.correlation[i], 2);
                    }
                    for (const i in res.stdv) {
                        res.stdv[i] = (0, utils_general_1.floor)(res.stdv[i], 2);
                    }
                    for (const i in res.slope) {
                        res.slope[i] = (0, utils_general_1.floor)(res.slope[i], 2);
                    }
                    yield this.saveToMongoDBUpsert(utils_trade_1.MONGODB_TABLE_TICKERSTATISTICS, res, { pair: tk.pair });
                }
            }
        });
    }
    updateBadget() {
        return __awaiter(this, void 0, void 0, function* () {
            // do nothing
        });
    }
    updateTrade() {
        return __awaiter(this, void 0, void 0, function* () {
            // do nothing
        });
    }
    clearPosition() {
        return __awaiter(this, void 0, void 0, function* () {
            // do nothing      
        });
    }
}
exports.TickerStatisticsCustomeClass = TickerStatisticsCustomeClass;
