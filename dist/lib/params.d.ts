import { BaseBotClass } from "./bot";
import { botCurrency } from "./types";
export interface BaseBotParams {
    baseCurrency: botCurrency;
    botLogic: string;
    botName: string;
    notifier?: (msg: string) => void;
    onHourly?: (bot: BaseBotClass) => void;
    onDaily?: (bot: BaseBotClass) => void;
    onWeekly?: (bot: BaseBotClass) => void;
}
