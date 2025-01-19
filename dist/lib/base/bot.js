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
const utils_mongodb_1 = require("utils-mongodb");
const utils_general_1 = require("utils-general");
const utils_trade_1 = require("utils-trade");
class BotFrameClass {
    constructor(_baseParams) {
        this._baseParams = _baseParams;
        this._botStatus = (0, utils_trade_1.getBaseBotStatus)();
        this._previousTicker = (0, utils_trade_1.getDefaultTicker)();
        this._currentTicker = (0, utils_trade_1.getDefaultTicker)();
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isBackTest || (yield this.getBotStatusAndIsContinue())) {
                try {
                    if (!this.isBackTest && (yield this.isStopOrClearPosition()))
                        return;
                    yield this.updateBadget();
                    this._previousTicker = this._currentTicker;
                    yield this.updateTicker();
                    yield this.updateTrade();
                    if (!this.isBackTest) {
                        this._botStatus.message = 'Normal.';
                        this._botStatus.lastDate = Date.now();
                        yield this.saveBotStatus();
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
                this._mongoDB = new utils_mongodb_1.MongodbManagerClass(utils_trade_1.MONGODB_DB_BOTSTATUS, this._baseParams.db);
                yield this._mongoDB.connect();
            }
            if (!this.isBackTest) {
                yield this.loadBotStatus(true);
            }
            yield this.updateTicker();
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
    getBotStatusAndIsContinue() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadBotStatus();
            return !this._botStatus.isExit;
        });
    }
    loadBotStatus(initialized) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.loadFromMongoDB(utils_trade_1.MONGODB_TABLE_BOTSTATUS, { botName: this._baseParams.botName });
            console.log(res);
            if (res == null || (Array.isArray(res) && res.length === 0)) {
                if (initialized) {
                    yield this.saveBotStatus();
                    return;
                }
                throw new Error('failed load botStatus');
            }
            this._botStatus = res[0];
        });
    }
    saveBotStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveToMongoDBUpsert(utils_trade_1.MONGODB_TABLE_BOTSTATUS, this._botStatus, { botName: this._baseParams.botName });
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
    get isBackTest() {
        return this._baseParams.isBackTest ? true : false;
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
