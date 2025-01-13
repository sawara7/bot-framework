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
exports.BotFrameClass = void 0;
// import {
//     RealtimeDatabaseClass,
//     getRealTimeDatabase
// } from "utils-firebase-server"
const utils_mongodb_1 = require("utils-mongodb");
const utils_trade_1 = require("utils-trade");
const types_1 = require("./types");
const utils_general_1 = require("utils-general");
class BotFrameClass {
    constructor(_baseParams) {
        this._baseParams = _baseParams;
        this._botStatus = (0, types_1.getBaseBotStatus)();
        this._botResult = (0, types_1.getBaseBotResult)();
        this._previousTicker = (0, utils_trade_1.getDefaultTicker)();
        this._currentTicker = (0, utils_trade_1.getDefaultTicker)();
        this._botResult.botName = this._baseParams.botName;
        this._botResult.logicName = this._baseParams.logicName;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isBackTest || (yield this.getBotStatusFromRealtimeDbAndIsContinue())) {
                try {
                    if (!this.isBackTest && (yield this.isStopOrClearPosition()))
                        return;
                    yield this.updateBadget();
                    this._previousTicker = this._currentTicker;
                    yield this.updateTicker();
                    yield this.updateTrade();
                    if (!this.isBackTest) {
                        this._botStatus.message = 'Normal.';
                        yield this.saveBotStatus();
                        yield this.saveBotResult();
                        yield this.saveBotStatistics();
                    }
                }
                catch (e) {
                    const err = e;
                    console.log(this._baseParams.botName, err.name, err.message);
                    this._botStatus.message = err.name + '/' + err.message;
                    yield this.saveBotStatus();
                }
                finally {
                    yield (0, utils_general_1.sleep)(this._baseParams.interval);
                    if (!this.isBackTest)
                        console.log(this._baseParams.botName, new Date().toLocaleString());
                }
            }
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this._botStatus.botName = this._baseParams.botName;
            if (!this.isBackTest) {
                // this._realtimeDB = await getRealTimeDatabase()
            }
            if (!this.isBackTest) {
                this._mongoDB = new utils_mongodb_1.MongodbManagerClass(types_1.MONGODB_DB_BOTSTATUS, this._baseParams.db);
                yield this._mongoDB.connect();
            }
            if (!this.isBackTest) {
                yield this.loadBotStatus(true);
                yield this.loadBotResult(true);
            }
            yield this.updateTicker();
            if (this._botResult.initialBadget === 0) {
                yield this.updateBadget();
                this._botResult.initialBadget = this._botResult.currentBadget;
            }
            if (isNaN(this._botResult.initialBadget) || this._botResult.initialBadget === 0) {
                throw new Error('Update initial badget error.');
            }
        });
    }
    isStopOrClearPosition() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._botStatus.isStop) {
                this._botStatus.message = 'Stopping...';
                yield this.saveBotStatus();
                yield (0, utils_general_1.sleep)(1000);
                return true;
            }
            if (this._botStatus.isClear) {
                yield this.clearPosition();
                this._botStatus.isClear = false;
                this._botStatus.isStop = true;
                this._botStatus.message = 'Position cleared.';
                yield this.saveBotStatus();
                yield (0, utils_general_1.sleep)(1000);
                return true;
            }
            return false;
        });
    }
    getBotStatusFromRealtimeDbAndIsContinue() {
        return __awaiter(this, void 0, void 0, function* () {
            // if (!this._realtimeDB) throw new Error("no realtime db.")
            // this._botStatus = await this._realtimeDB.get(await this._realtimeDB.getReference("botStatus/" + this._baseParams.botName)) as BaseBotStatus
            // return !this._botStatus.isExit
            return true;
        });
    }
    loadBotStatus(initialized) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.loadFromMongoDB(types_1.MONGODB_TABLE_BOTSTATUS, { botName: this._baseParams.botName });
            if (res == null || (Array.isArray(res) && res.length === 0)) {
                if (initialized) {
                    yield this.saveBotStatus();
                    return;
                }
                throw new Error('failed load botStatus');
            }
            this._botStatus = res;
        });
    }
    saveBotStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveToMongoDBUpsert(types_1.MONGODB_TABLE_BOTSTATUS, this._botStatus, { botName: this._baseParams.botName });
        });
    }
    loadBotResult(initialized) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.loadFromRealtimeDB(types_1.MONGODB_TABLE_BOTRESULT);
            if (res == null) {
                if (initialized) {
                    yield this.saveBotResult();
                    return;
                }
                throw new Error('failed load botResult');
            }
            this._botResult = res;
        });
    }
    saveBotResult() {
        return __awaiter(this, void 0, void 0, function* () {
            this._botResult.ticker = this.currentTicker;
            this._botResult.updateTimestamp = new Date().toLocaleString();
            yield this.saveToMongoDBUpsert(types_1.MONGODB_TABLE_BOTRESULT, this.botResult, { botName: this._baseParams.botName });
        });
    }
    loadFromMongoDB(path, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isBackTest && this.mongoDB) {
                const res = yield this.mongoDB.find(path, filter);
                if (res.result)
                    return res.data;
            }
        });
    }
    saveToMongoDBUpsert(path_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (path, data, filter = {}) {
            if (!this.isBackTest && this.mongoDB) {
                yield this.mongoDB.upsert(path, filter, data);
            }
        });
    }
    saveToMongoDBInsert(path, data, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isBackTest && this.mongoDB) {
                yield this.mongoDB.insert(path, data);
            }
        });
    }
    loadFromRealtimeDB(path) {
        return __awaiter(this, void 0, void 0, function* () {
            // if (!this._realtimeDB) throw new Error("no realtime db.")
            // return await this._realtimeDB.get(await this._realtimeDB.getReference(path + "/" + this._baseParams.botName))
            return null;
        });
    }
    saveToRealtimeDB(path_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (path, data, setBotName = true) {
            // if (!this._realtimeDB) throw new Error("no realtime db.")
            // const s = setBotName? this._baseParams.botName: ''
            // await this._realtimeDB.set(path + '/' + this._baseParams.botName, data)
        });
    }
    get isBackTest() {
        return this._baseParams.isBackTest ? true : false;
    }
    get botResult() {
        return this._botResult;
    }
    get cumulativeProfit() {
        return this._botResult.cumulativeProfit;
    }
    set cumulativeProfit(value) {
        this._botResult.cumulativeProfit = value;
    }
    get currentBadget() {
        return this._botResult.currentBadget;
    }
    set currentBadget(badget) {
        this._botResult.currentBadget = badget;
    }
    get initialBadget() {
        return this._botResult.initialBadget;
    }
    get currentTicker() {
        return this._currentTicker;
    }
    set currentTicker(tk) {
        this._currentTicker = tk;
    }
    get previousTicker() {
        return this._previousTicker;
    }
    get mongoDB() {
        if (!this._mongoDB)
            throw new Error('no mongoDB.');
        return this._mongoDB;
    }
}
exports.BotFrameClass = BotFrameClass;
