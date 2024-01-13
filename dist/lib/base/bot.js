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
const utils_firebase_server_1 = require("utils-firebase-server");
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
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initialize();
            while (this.isBackTest || (yield this.getBotStatusFromRealtimeDbAndIsContinue())) {
                try {
                    if (!this.isBackTest && (yield this.isStopOrClearPosition()))
                        continue;
                    yield this.updateBadget();
                    yield this.updateTicker();
                    this._previousTicker = this._currentTicker;
                    this._botResult.ticker = this.currentTicker;
                    yield this.updateTrade();
                    if (!this.isBackTest) {
                        this._botStatus.message = 'Normal.';
                        yield this.saveBotStatus();
                        yield this.saveBotResult();
                    }
                }
                catch (e) {
                    const err = e;
                    console.log(this._baseParams.botName, err.name, err.message);
                    this._botStatus = {
                        isClear: false,
                        isStop: true,
                        isExit: false,
                        message: err.name + '/' + err.message
                    };
                    this._botResult.updateTimestamp = new Date().toLocaleString();
                    yield this.saveBotStatus();
                }
                finally {
                    if (!this.isBackTest)
                        console.log(this._baseParams.botName, new Date().toLocaleString());
                }
            }
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isBackTest) {
                this._realtimeDB = yield (0, utils_firebase_server_1.getRealTimeDatabase)();
            }
            if (!this.isBackTest) {
                this._mongoDB = new utils_mongodb_1.MongodbManagerClass(this._baseParams.mongoDbName);
                yield this._mongoDB.connect();
            }
            if (!this.isBackTest) {
                yield this.loadBotStatus(true);
                yield this.loadBotResult(true);
            }
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
                yield (0, utils_general_1.sleep)(1000);
                return true;
            }
            if (this._botStatus.isClear) {
                yield this.clearPosition();
                this._botStatus.isClear = false;
                this._botStatus.message = 'Position cleared.';
                yield (0, utils_general_1.sleep)(1000);
                return true;
            }
            return false;
        });
    }
    getBotStatusFromRealtimeDbAndIsContinue() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._realtimeDB)
                throw new Error("no realtime db.");
            this._botStatus = (yield this._realtimeDB.get(yield this._realtimeDB.getReference("botStatus/" + this._baseParams.botName)));
            return !this._botStatus.isExit;
        });
    }
    loadBotStatus(initialized) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.loadFromRealtimeDB(types_1.MONGO_PATH_BOTSTATUS);
            if (res == null) {
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
            yield this.saveToRealtimeDB(types_1.MONGO_PATH_BOTSTATUS, this._botStatus);
        });
    }
    loadBotResult(initialized) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.loadFromRealtimeDB(types_1.MONGO_PATH_BOTRESULT);
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
            yield this.saveToRealtimeDB(types_1.MONGO_PATH_BOTRESULT, this.botResult);
        });
    }
    loadFromMongoDB(path, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isBackTest && this._mongoDB) {
                const res = yield this._mongoDB.find(path, filter);
                if (res.result)
                    return res.data;
            }
        });
    }
    saveToMongoDB(path, data, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isBackTest && this._mongoDB) {
                yield this._mongoDB.upsert(path, filter, data);
            }
        });
    }
    loadFromRealtimeDB(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._realtimeDB)
                throw new Error("no realtime db.");
            return yield this._realtimeDB.get(yield this._realtimeDB.getReference(path + "/" + this._baseParams.botName));
        });
    }
    saveToRealtimeDB(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._realtimeDB)
                throw new Error("no realtime db.");
            yield this._realtimeDB.set(path + '/' + this._baseParams.botName, data);
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
