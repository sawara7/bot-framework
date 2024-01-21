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
exports.BotNampingForwardClass = void 0;
const base_1 = require("./base");
class BotNampingForwardClass extends base_1.BaseBotNampingClass {
    constructor(nampingParams) {
        super(nampingParams);
    }
    checkCancelOpenOrder(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            const openPrice = yield this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).openPrice;
            return this.checkCancelLimitOrder(openPrice, pos.openSide);
        });
    }
    checkCancelCloseOrder(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            const closePrice = this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).closePrice;
            return this.checkCancelLimitOrder(closePrice, pos.openSide === "buy" ? "sell" : "buy");
        });
    }
    checkCancelLimitOrder(price, side) {
        if ((side === "buy" && price < this.previousTicker.ask * (1 - this.nampingParams.limitOrderLowerRate * 1.1)) || (side === "sell" && price > this.previousTicker.bid * (1 + this.nampingParams.limitOrderUpperRate * 1.1))) {
            return true;
        }
        return false;
    }
    checkOpenOrder(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            const openPrice = yield this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).openPrice;
            return this.checkEnabledLimitOrder(openPrice, pos.openSide);
        });
    }
    checkCloseOrder(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            const closePrice = this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).closePrice;
            return this.checkEnabledLimitOrder(closePrice, pos.openSide === "buy" ? "sell" : "buy");
        });
    }
    checkEnabledLimitOrder(price, side) {
        if ((side === "buy" &&
            price <= this.currentTicker.ask &&
            price >= this.currentTicker.ask * (1 - this.nampingParams.limitOrderLowerRate)) || (side === "sell" &&
            price >= this.currentTicker.bid &&
            price <= this.currentTicker.bid * (1 + this.nampingParams.limitOrderUpperRate))) {
            return true;
        }
        return false;
    }
}
exports.BotNampingForwardClass = BotNampingForwardClass;
