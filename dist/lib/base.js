"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBotClass = exports.botCurrencyList = void 0;
const uuid_1 = require("uuid");
exports.botCurrencyList = [
    'JPY',
    'USD'
];
class BaseBotClass {
    constructor(baseParams) {
        this._uuid = (0, uuid_1.v4)();
        this._startTime = Date.now();
        this._id = baseParams.botID;
        this._name = baseParams.botName;
        this._logic = baseParams.botLogic;
        this._baseCurrency = baseParams.baseCurrency;
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
}
exports.BaseBotClass = BaseBotClass;
