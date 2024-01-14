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
exports.BotNampingReverseClass = void 0;
const base_1 = require("./base");
class BotNampingReverseClass extends base_1.BaseBotNampingClass {
    constructor(nampingParams) {
        super(nampingParams);
    }
    checkCancelOpenOrder(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    checkCancelCloseOrder(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    checkOpenOrder(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            const openPrice = yield this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).openPrice;
            if ((pos.openSide === "buy" &&
                this.currentTicker.ask >= openPrice &&
                openPrice > this.previousTicker.ask &&
                this.multiPositionStatistics.buyAveragePrice < this.currentTicker.ask) || (pos.openSide === "sell" &&
                this.currentTicker.bid <= openPrice &&
                openPrice < this.previousTicker.bid &&
                this.multiPositionStatistics.sellAveragePrice > this.currentTicker.bid)) {
                return true;
            }
            return false;
        });
    }
    checkCloseOrder(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            // take profit
            if ((pos.openSide === "sell" && pos.openPrice * (1 - this.logicSettings.profitRate) > this.currentTicker.ask) || (pos.openSide === "buy" && pos.openPrice * (1 + this.logicSettings.profitRate) < this.currentTicker.bid)) {
                return true;
            }
            return false;
        });
    }
    checkLosscutOrder(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            // losscut
            if ((pos.openSide === "sell" && pos.openPrice * (1 + this.logicSettings.losscutRate) < this.currentTicker.ask) || (pos.openSide === "buy" && pos.openPrice * (1 - this.logicSettings.losscutRate) > this.currentTicker.bid)) {
                return true;
            }
            return false;
        });
    }
}
exports.BotNampingReverseClass = BotNampingReverseClass;
