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
exports.TickerCollectorCustomeClass = void 0;
const bot_1 = require("../base/bot");
const MONGO_PATH_TICKER = 'ticker';
class TickerCollectorCustomeClass extends bot_1.BotFrameClass {
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
            for (const k of this._params.syumbols) {
                const tk = yield this.updateSingleTicker(k);
                yield this.saveToMongoDB(this.getTickerPath(k), tk);
            }
        });
    }
    getTickerPath(key) {
        return MONGO_PATH_TICKER + '/' + key;
    }
    saveBotStatistics() {
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
exports.TickerCollectorCustomeClass = TickerCollectorCustomeClass;
