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
exports.BaseBotClass = exports.botCurrencyList = void 0;
const uuid_1 = require("uuid");
const slack_notification_1 = require("slack-notification");
exports.botCurrencyList = [
    'JPY',
    'USD'
];
class BaseBotClass {
    constructor(params) {
        this._enabled = false;
        this._uuid = (0, uuid_1.v4)();
        this._startTime = Date.now();
        this._id = params.botID;
        this._name = params.botName;
        this._logic = params.botLogic;
        this._baseCurrency = params.baseCurrency;
        this._notificationChannel = params.notificationChannel;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._enabled) {
                throw new Error('start failed.');
            }
            if (this._notificationChannel) {
                this._notifier = yield (0, slack_notification_1.getSlackNotifier)(this._notificationChannel);
            }
            this._enabled = true;
            this.notice("Start: " + this.botName);
            yield this.doStart();
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._enabled) {
                this.notice("Stop failed");
                throw new Error('stop failed.');
            }
            this._enabled = false;
            yield this.doStop();
            this.notice("Stop: " + this.botName);
        });
    }
    get uuid() {
        return this._uuid;
    }
    get id() {
        return this._id;
    }
    get botName() {
        return this._name;
    }
    get botLogic() {
        return this._logic;
    }
    get baseCurrency() {
        return this._baseCurrency;
    }
    get startTime() {
        return this._startTime;
    }
    get enabled() {
        return this._enabled;
    }
    notice(msg) {
        if (this._notifier) {
            this._notifier.sendMessage(msg);
        }
    }
    get botResult() {
        return {
            time: Date.now(),
            botID: this.id,
            baseCurrency: this.baseCurrency,
            botLogic: this.botLogic,
            botName: this.botName,
            startTime: this.startTime,
            uuid: this.uuid
        };
    }
}
exports.BaseBotClass = BaseBotClass;
