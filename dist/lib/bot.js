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
exports.BaseBotClass = void 0;
const node_cron_1 = require("node-cron");
const my_utils_1 = require("my-utils");
class BaseBotClass extends my_utils_1.BaseObjectClass {
    constructor(params) {
        super();
        this._enabled = false;
        this._unrealizedProfit = 0;
        this._totalProfit = 0;
        this._previousHourlyProfit = 0;
        this._hourlyProfit = 0;
        this._startTime = Date.now();
        this._name = params.botName;
        this._logic = params.botLogic;
        this._baseCurrency = params.baseCurrency;
        this._notifier = params.notifier;
        this._onHourly = params.onHourly;
    }
    import(j) {
        super.import(j);
        const v = j;
        this._name = v._name;
        this._logic = v._logic;
        this._baseCurrency = v._baseCurrency;
        this._startTime = v._startTime;
        this._enabled = v._enabled;
    }
    export() {
        const v = super.export();
        v._startTime = this._startTime;
        v._name = this._name;
        v._logic = this._logic;
        v._baseCurrency = this._baseCurrency;
        return v;
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
            this._unrealizedProfit = this.calcUnrealizedProfit();
            this._hourlyProfit = this._totalProfit - this._previousHourlyProfit;
            if (this._onHourly) {
                yield this._onHourly(this);
            }
            this._previousHourlyProfit = this._totalProfit;
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
    get unrealizedProfit() {
        return this._unrealizedProfit;
    }
    notice(msg) {
        if (this._notifier) {
            this._notifier(msg);
        }
    }
    get botResult() {
        return {
            time: Date.now(),
            botID: this.uuid,
            baseCurrency: this.baseCurrency,
            botLogic: this.botLogic,
            botName: this.botName,
            startTime: this.startTime,
            uuid: this.uuid,
            totalProfit: this.totalProfit,
            hourlyProfit: this.hourlyProfit,
            unrealizedProfit: this.unrealizedProfit
        };
    }
}
exports.BaseBotClass = BaseBotClass;
