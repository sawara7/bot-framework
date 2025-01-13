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
exports.BotMultiPositionClass = void 0;
const utils_trade_1 = require("utils-trade");
const types_1 = require("./types");
const bot_1 = require("../base/bot");
const base_1 = require("../base");
class BotMultiPositionClass extends bot_1.BotFrameClass {
    constructor(_params) {
        super(_params);
        this._params = _params;
        this._debugPositions = {};
        this._multiPositionsStatistics = (0, types_1.getDefaultMultiPositionStatistics)();
        this._activeOrderIDs = [];
        this._activeOrders = [];
        this._closedOrders = {};
    }
    initialize() {
        const _super = Object.create(null, {
            initialize: { get: () => super.initialize }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.initialize.call(this);
            for (const s of this._params.targetSides) {
                for (let i = 0; i < this._params.positionSize; i++) {
                    const data = yield this.getPosition(s + i);
                    if (data.length === 0) {
                        const mongoPos = {
                            mongoID: s + i,
                            mongoIndex: i,
                            isOpened: false,
                            isClosed: false,
                            openSide: s,
                            openSize: 0,
                            openPrice: 0,
                            openOrderType: 'limit',
                            openOrderID: '',
                            closePrice: 0,
                            closeOrderType: 'limit',
                            closeOrderID: ''
                        };
                        if (this.isBackTest) {
                            this._debugPositions[s + i] = mongoPos;
                        }
                        else {
                            yield this.saveToMongoDBUpsert(this.positionTableName, mongoPos, { mongoID: mongoPos.mongoID });
                        }
                    }
                }
            }
        });
    }
    updateTrade() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateMultiPositionStatisticsAndUpdateActiveOrders();
            const res = yield this.getActiveOrders(this._activeOrderIDs);
            if (!res.success)
                return;
            this._activeOrders = res.activeOrderIDs;
            const res2 = yield this.getClosedOrders(this._activeOrderIDs);
            if (!res2.success)
                return;
            this._closedOrders = res2.closedOrders;
            yield this.positionLoop((pos) => __awaiter(this, void 0, void 0, function* () {
                if (!pos.isOpened && !pos.isClosed && pos.openOrderID === '') {
                    // if 何もしていない
                    // do Open注文する
                    const res = yield this.sendOpenOrder(pos);
                    if (res.success) {
                        pos.openOrderID = res.orderID;
                        pos.openOrderType = res.orderType;
                        yield this.updatePosition(pos);
                    }
                    return;
                }
                if (!pos.isOpened && !pos.isClosed && pos.openOrderID !== '') {
                    // 注文が有効
                    if (this._activeOrders.includes(pos.openOrderID)) {
                        if (yield this.checkCancelOpenOrder(pos)) {
                            const res = yield this.cancelOrder(pos);
                            if (res.success) {
                                pos.openOrderID = '';
                                yield this.updatePosition(pos);
                            }
                        }
                        return;
                    }
                    // 注文が約定
                    if (Object.keys(this._closedOrders).includes(pos.openOrderID)) {
                        const od = this._closedOrders[pos.openOrderID];
                        pos.isOpened = true;
                        pos.openPrice = od.price;
                        pos.openSize = od.size;
                        pos.openOrderID = '';
                        yield this.updatePosition(pos);
                        return;
                    }
                    // 注文が存在しない
                    pos.openOrderID = '';
                    yield this.updatePosition(pos);
                    return;
                }
                if (pos.isOpened && !pos.isClosed && pos.closeOrderID === '') {
                    // if Open状態でClose注文していない
                    // do Close注文する
                    const res = yield this.sendCloseOrder(pos);
                    if (res.success) {
                        pos.closeOrderID = res.orderID;
                        pos.closeOrderType = res.orderType;
                        yield this.updatePosition(pos);
                    }
                    return;
                }
                if (pos.isOpened && !pos.isClosed && pos.closeOrderID !== '') {
                    // 注文が有効
                    if (this._activeOrders.includes(pos.closeOrderID)) {
                        if (yield this.checkCancelCloseOrder(pos)) {
                            const res = yield this.cancelOrder(pos);
                            if (res.success) {
                                pos.closeOrderID = '';
                                yield this.updatePosition(pos);
                            }
                        }
                        return;
                    }
                    // 注文が約定
                    if (Object.keys(this._closedOrders).includes(pos.closeOrderID)) {
                        pos.isClosed = true;
                        pos.closePrice = this._closedOrders[pos.closeOrderID].price;
                        pos.closeOrderID = '';
                        yield this.updatePosition(pos);
                        return;
                    }
                    // 注文がない
                    pos.closeOrderID = '';
                    yield this.updatePosition(pos);
                    return;
                }
                if (pos.isOpened && pos.isClosed) {
                    // if Positionが完了した
                    // do Positionをリセットする
                    const openFeeRate = (pos.openOrderType === "limit" ? this._params.feeLimitPercent : this._params.feeMarketPercent) / 100;
                    const openFee = pos.openPrice * pos.openSize * openFeeRate;
                    const closeFeeRate = (pos.closeOrderType === "limit" ? this._params.feeLimitPercent : this._params.feeMarketPercent) / 100;
                    const closeFee = pos.closePrice * pos.openSize * closeFeeRate;
                    const unrealizedPL = (0, utils_trade_1.getUnrealizedPL)(pos.openSide, this.currentTicker, pos.openPrice, pos.openSize) - openFee - closeFee;
                    this.cumulativeProfit += unrealizedPL;
                    pos.isOpened = false;
                    pos.isClosed = false;
                    pos.closePrice = 0;
                    pos.openPrice = 0;
                    pos.openSize = 0;
                    yield this.updatePosition(pos);
                    const upl = {
                        date: Date.now(),
                        cumulativePL: unrealizedPL,
                        botName: this._params.botName
                    };
                    yield this.saveToMongoDBInsert(base_1.MONGODB_TABLE_CUMULATIVEPL, upl);
                    return;
                }
            }));
        });
    }
    clearPosition() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateTicker();
            yield this.updateMultiPositionStatisticsAndUpdateActiveOrders();
            const res = yield this.getActiveOrders(this._activeOrderIDs);
            if (!res.success)
                return;
            this._activeOrders = res.activeOrderIDs;
            const res2 = yield this.getClosedOrders(this._activeOrderIDs);
            if (!res2.success)
                return;
            this._closedOrders = res2.closedOrders;
            yield this.positionLoop((pos) => __awaiter(this, void 0, void 0, function* () {
                if (pos.isOpened && !pos.isClosed && pos.closeOrderID === '') {
                    // if Open状態でClose注文していない
                    // do Close注文す
                    const res = yield this.sendCloseOrder(pos, true);
                    if (res.success) {
                        pos.closeOrderID = res.orderID;
                        pos.closeOrderType = res.orderType;
                        yield this.updatePosition(pos);
                    }
                    return;
                }
                if (pos.isOpened && !pos.isClosed && pos.closeOrderID !== '') {
                    // if Close注文が成約したか
                    // do Close状態にする
                    if (this._activeOrders.includes(pos.closeOrderID)) {
                        const res1 = yield this.cancelOrder(pos);
                        if (res1.success) {
                            pos.closeOrderID = '';
                            yield this.updatePosition(pos);
                        }
                        const res2 = yield this.sendCloseOrder(pos, true);
                        if (res.success) {
                            pos.closeOrderID = res2.orderID;
                            pos.closeOrderType = res2.orderType;
                            yield this.updatePosition(pos);
                        }
                    }
                    return;
                }
                if (!pos.isOpened && !pos.isClosed && pos.closeOrderID !== '') {
                    if (this._activeOrders.includes(pos.closeOrderID)) {
                        const res = yield this.cancelOrder(pos);
                        if (res.success) {
                            pos.closeOrderID = '';
                            yield this.updatePosition(pos);
                        }
                    }
                    return;
                }
            }));
        });
    }
    updateMultiPositionStatisticsAndUpdateActiveOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = (0, types_1.getDefaultMultiPositionStatistics)();
            let buyCap = 0;
            let sellCap = 0;
            this._activeOrderIDs = [];
            result.botName = this._params.botName;
            yield this.positionLoop((pos) => __awaiter(this, void 0, void 0, function* () {
                if (pos.openOrderID !== '')
                    this._activeOrderIDs.push(pos.openOrderID);
                if (pos.closeOrderID !== '')
                    this._activeOrderIDs.push(pos.closeOrderID);
                if (!pos.isOpened)
                    return;
                if (pos.isClosed)
                    return;
                if (pos.openSide === "buy") {
                    result.buySize += pos.openSize;
                    buyCap += (pos.openSize * pos.openPrice);
                    result.buyPositionNum++;
                }
                else if (pos.openSide === "sell") {
                    result.sellSize += pos.openSize;
                    sellCap += (pos.openSize * pos.openPrice);
                    result.sellPositionNum++;
                }
                result.unrealized += (0, utils_trade_1.getUnrealizedPL)(pos.openSide, this.currentTicker, pos.openPrice, pos.openSize);
            }));
            result.buyAveragePrice = result.buySize > 0 ? buyCap / result.buySize : 0;
            result.sellAveragePrice = result.sellSize > 0 ? sellCap / result.sellSize : 1000000000;
            this._multiPositionsStatistics = result;
        });
    }
    getPositions() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isBackTest) {
                const result = {};
                const res = yield this.mongoDB.find(this.positionTableName);
                if (!res.result || !res.data)
                    throw new Error('get positions error');
                for (const pos of res.data) {
                    result[pos.mongoID] = pos;
                }
                return result;
            }
            return this._debugPositions;
        });
    }
    getPosition(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isBackTest) {
                const res = yield this.mongoDB.find(this.positionTableName, { mongoID: id });
                const data = res.data;
                return data;
            }
            if (this._debugPositions[id])
                return [this._debugPositions[id]];
            return [];
        });
    }
    updatePosition(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isBackTest) {
                yield this.mongoDB.update(this.positionTableName, { mongoID: pos.mongoID }, pos);
            }
            else {
                this._debugPositions[pos.mongoID] = pos;
            }
        });
    }
    positionLoop(proc) {
        return __awaiter(this, void 0, void 0, function* () {
            const positions = yield this.getPositions();
            for (const s of this._params.targetSides) {
                for (let i = 0; i <= this._params.positionSize - 1; i++) {
                    const pos = positions[s + i];
                    if (pos)
                        yield proc(pos);
                }
            }
        });
    }
    saveBotStatistics() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(base_1.MONGODB_TABLE_BOTSTATISTICS, this.multiPositionStatistics, { botName: this._params.botName });
            yield this.saveToMongoDBUpsert(base_1.MONGODB_TABLE_BOTSTATISTICS, this.multiPositionStatistics, { botName: this._params.botName });
        });
    }
    get multiPositionStatistics() {
        return this._multiPositionsStatistics;
    }
    get positionTableName() {
        return types_1.MONGO_PATH_POSITIONS + '-' + this._params.mongoDbName;
    }
}
exports.BotMultiPositionClass = BotMultiPositionClass;
