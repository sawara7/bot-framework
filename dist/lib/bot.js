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
class BotFrameClass {
    constructor(_baseParams) {
        this._baseParams = _baseParams;
        this._totalProfit = 0;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initialize();
            while (true) {
                try {
                    yield this.update();
                }
                catch (e) {
                    console.log(this._baseParams.botName, e);
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
            if (!this.isBackTest)
                this._rdb = yield (0, utils_firebase_server_1.getRealTimeDatabase)();
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isBackTest)
                yield this.setRealtimeDatabase();
        });
    }
    setRealtimeDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._rdb)
                yield this._rdb.set('bot/' + this._baseParams.botName, yield this.getBotResult());
        });
    }
    get isBackTest() {
        return this._baseParams.isBackTest ? true : false;
    }
    get totalProfit() {
        return this._totalProfit;
    }
    set totalProfit(value) {
        this._totalProfit = value;
    }
    getBotResult() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                botName: this._baseParams.botName,
                logicName: this._baseParams.logicName,
                updateTimestamp: new Date().toLocaleString(),
                totalProfit: this.totalProfit.toString()
            };
        });
    }
}
exports.BotFrameClass = BotFrameClass;
