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
exports.BaseBotNampingClass = void 0;
const multiPosition_1 = require("../multiPosition");
const logic_namping_1 = require("logic-namping");
class BaseBotNampingClass extends multiPosition_1.BotMultiPositionClass {
    constructor(_nampingParams) {
        super(_nampingParams);
        this._nampingParams = _nampingParams;
        this.currentBadget = 0;
        this._logic = new logic_namping_1.LogicNampingClass(this._nampingParams.logicParams);
    }
    updateBadget() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isBackTest) {
                // this.currentBadget = this.initialBadget + this.cumulativeProfit // + this.unrealized
            }
            else {
                this.currentBadget = yield this.getBadget();
            }
            this._logic.updateBadget(this.currentBadget);
        });
    }
    sendOpenOrder(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.checkOpenOrder(pos))
                return yield this.doSendOpenOrder(pos);
            return (0, multiPosition_1.getDefaultSendOpenOrderResult)();
        });
    }
    sendCloseOrder(pos, force) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = (0, multiPosition_1.getDefaultSendCloseOrderResult)();
            if (force) {
                return yield this.doSendCloseOrder(pos, true);
            }
            // take profit
            if (this.logicSettings.profitRate > 0 &&
                (yield this.checkCloseOrder(pos)))
                return yield this.doSendCloseOrder(pos);
            // losscut
            if (this.logicSettings.losscutRate > 0 &&
                (yield this.checkLosscutOrder(pos)))
                return yield this.doSendCloseOrder(pos, true);
            return res;
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
    get nampingParams() {
        return this._nampingParams;
    }
    get logic() {
        return this._logic;
    }
    get logicSettings() {
        return this._nampingParams.logicParams;
    }
}
exports.BaseBotNampingClass = BaseBotNampingClass;
