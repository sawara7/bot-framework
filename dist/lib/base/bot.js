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
const types_1 = require("./types");
const utils_general_1 = require("utils-general");
class BotFrameClass {
    constructor(_baseParams) {
        this._baseParams = _baseParams;
        this._cumulativeProfit = 0;
        this._botStatus = (0, types_1.getBaseBotStatus)();
        this._initialBadget = 0;
        this._currentBadget = 0;
        this._previousTicker = (0, types_1.getDefaultTicker)();
        this._currentTicker = (0, types_1.getDefaultTicker)();
        // 
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
                    yield this.updateTrade();
                    if (!this.isBackTest)
                        yield this.setBotResultToRealtimeDB();
                }
                catch (e) {
                    const err = e;
                    console.log(this._baseParams.botName, err.name, err.message);
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
            if (!this.isBackTest && this._baseParams.useRealtimeDB) {
                this._realtimeDB = yield (0, utils_firebase_server_1.getRealTimeDatabase)();
                yield this.setBotStatusToRealtimeDB();
            }
            if (!this.isBackTest && this._baseParams.useMongoDBAndDBName) {
                this._mongoDB = new utils_mongodb_1.MongodbManagerClass(this._baseParams.useMongoDBAndDBName);
                yield this._mongoDB.connect();
            }
            yield this.updateBadget();
            this._initialBadget = this._currentBadget;
            if (isNaN(this._initialBadget) || this._initialBadget === 0) {
                throw new Error('Update initial badget error.');
            }
        });
    }
    isStopOrClearPosition() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._botStatus.isStop) {
                yield (0, utils_general_1.sleep)(1000);
                return true;
            }
            if (this._botStatus.isClear) {
                yield this.clearPosition();
                this._botStatus.isClear = false;
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
    setBotStatusToRealtimeDB() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._realtimeDB)
                throw new Error("no realtime db.");
            yield this._realtimeDB.set("botStatus/" + this._baseParams.botName, this._botStatus);
        });
    }
    setBotResultToRealtimeDB() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._realtimeDB)
                yield this._realtimeDB.set('botResult/' + this._baseParams.botName, yield this.getBotResult());
        });
    }
    get isBackTest() {
        return this._baseParams.isBackTest ? true : false;
    }
    getBotResult() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                botName: this._baseParams.botName,
                logicName: this._baseParams.logicName,
                updateTimestamp: new Date().toLocaleString(),
                cumulativeProfit: this.cumulativeProfit.toString(),
                currentBadget: this.currentBadget.toString(),
                initialBadget: this.initialBadget.toString(),
                ticker: this.currentTicker
            };
        });
    }
    get cumulativeProfit() {
        return this._cumulativeProfit;
    }
    set cumulativeProfit(value) {
        this._cumulativeProfit = value;
    }
    get currentBadget() {
        return this._currentBadget;
    }
    set currentBadget(badget) {
        this._currentBadget = badget;
    }
    get initialBadget() {
        return this._initialBadget;
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
}
exports.BotFrameClass = BotFrameClass;
