"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBotClass = void 0;
class BaseBotClass {
    constructor(baseParams) {
        this.baseParams = baseParams;
    }
    get botName() {
        return this.baseParams.botName;
    }
}
exports.BaseBotClass = BaseBotClass;
