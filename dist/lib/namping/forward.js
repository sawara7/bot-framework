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
            if ((pos.openSide === "buy" && openPrice * (1 + this.logicSettings.profitRate * 2) < this.previousTicker.ask) || (pos.openSide === "sell" && openPrice * (1 - this.logicSettings.profitRate * 2) > this.previousTicker.bid)) {
                return true;
            }
            return false;
        });
    }
    checkCancelCloseOrder(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            const closePrice = this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).closePrice;
            if ((pos.openSide === "buy" && closePrice * (1 + this.logicSettings.profitRate * 2) < this.currentTicker.ask) || (pos.openSide === "sell" && closePrice * (1 - this.logicSettings.profitRate * 2) > this.currentTicker.bid)) {
                return true;
            }
            return false;
        });
    }
    checkOpenOrder(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            const openPrice = yield this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).openPrice;
            if ((pos.openSide === "buy" &&
                openPrice <= this.currentTicker.ask &&
                openPrice >= this.currentTicker.ask * (1 - this.logicSettings.profitRate * 1.5)) || (pos.openSide === "sell" &&
                openPrice >= this.currentTicker.bid &&
                openPrice <= this.currentTicker.bid * (1 + this.logicSettings.profitRate * 1.5))) {
                return true;
            }
            return false;
        });
    }
    checkCloseOrder(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            const closePrice = this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).closePrice;
            if ((pos.openSide === "sell" &&
                closePrice <= this.currentTicker.ask &&
                closePrice >= this.currentTicker.ask * (1 - this.logicSettings.profitRate * 1.5)) || (pos.openSide === "buy" &&
                closePrice >= this.currentTicker.bid &&
                closePrice <= this.currentTicker.bid * (1 + this.logicSettings.profitRate * 1.5))) {
                return true;
            }
            return false;
        });
    }
    checkLosscutOrder(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            const losscutPrice = this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).losscutPrice;
            if ((pos.openSide === "sell" &&
                losscutPrice < this.currentTicker.ask) || (pos.openSide === "buy" &&
                losscutPrice > this.currentTicker.bid)) {
                return true;
            }
            return false;
        });
    }
}
exports.BotNampingForwardClass = BotNampingForwardClass;
