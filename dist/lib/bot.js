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
    constructor(_params) {
        this._params = _params;
        this._result = {
            updateTimestamp: Date.now().toString(),
            totalProfit: '0'
        };
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this._rdb = yield (0, utils_firebase_server_1.getRealTimeDatabase)();
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initialize();
            while (true) {
                try {
                    yield this.update();
                }
                catch (e) {
                    console.log(this._params.botName, e);
                }
                finally {
                    console.log(this._params.botName, new Date().toLocaleString());
                }
            }
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setRealtimeDatabase();
        });
    }
    setRealtimeDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._rdb)
                yield this._rdb.set('bot/' + this._params.botName, this._result);
        });
    }
}
exports.BotFrameClass = BotFrameClass;
