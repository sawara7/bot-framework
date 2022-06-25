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
const node_cron_1 = require("node-cron");
const uuid_1 = require("uuid");
exports.botCurrencyList = [
    'JPY',
    'USD'
];
class BaseBotClass {
    constructor(params) {
        this._enabled = false;
        this._totalProfit = 0;
        this._previousHourlyProfit = 0;
        this._hourlyProfit = 0;
        this._previousDailyProfit = 0;
        this._dailyProfit = 0;
        this._previousWeeklyProfit = 0;
        this._weeklyProfit = 0;
        this._uuid = (0, uuid_1.v4)();
        this._startTime = Date.now();
        this._id = params.botID;
        this._name = params.botName;
        this._logic = params.botLogic;
        this._baseCurrency = params.baseCurrency;
        this._notifier = params.notifier;
        this._onHourly = params.onHourly;
        this._onDaily = params.onDaily;
        this._onWeekly = params.onWeekly;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._enabled) {
                throw new Error('start failed.');
            }
            this._enabled = true;
            this.notice("Start: " + this.botName);
            this.schedule();
            yield this.doStart();
        });
    }
    schedule() {
        // hourly
        (0, node_cron_1.schedule)('59 * * * *', () => __awaiter(this, void 0, void 0, function* () {
            this._totalProfit = this.calcTotalProfit();
            this._hourlyProfit = this._totalProfit - this._previousHourlyProfit;
            if (this._onHourly) {
                yield this._onHourly(this);
            }
            this._previousHourlyProfit = this._totalProfit;
            this._hourlyProfit = 0;
        }));
        // daily
        (0, node_cron_1.schedule)('59 23 * * *', () => __awaiter(this, void 0, void 0, function* () {
            this._totalProfit = this.calcTotalProfit();
            this._dailyProfit = this._totalProfit - this._previousDailyProfit;
            if (this._onDaily) {
                yield this._onDaily(this);
            }
            this._previousDailyProfit = this._totalProfit;
            this._dailyProfit = 0;
        }));
        // weekly
        (0, node_cron_1.schedule)('59 23 * * 6', () => __awaiter(this, void 0, void 0, function* () {
            this._totalProfit = this.calcTotalProfit();
            this._weeklyProfit = this._totalProfit - this._previousWeeklyProfit;
            if (this._onWeekly) {
                yield this._onWeekly(this);
            }
            this._previousWeeklyProfit = this._totalProfit;
            this._weeklyProfit = 0;
        }));
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
    get totalProfit() {
        return this._totalProfit;
    }
    get hourlyProfit() {
        return this._hourlyProfit;
    }
    get dailyProfit() {
        return this._dailyProfit;
    }
    get weeklyProfit() {
        return this._weeklyProfit;
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
            uuid: this.uuid,
            totalProfit: this.totalProfit,
            hourlyProfit: this.hourlyProfit,
            dailyProfit: this.dailyProfit,
            weeklyProfit: this.weeklyProfit
        };
    }
}
exports.BaseBotClass = BaseBotClass;
