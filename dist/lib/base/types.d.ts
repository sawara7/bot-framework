import { Ticker } from "utils-trade";
export declare const MONGO_PATH_BOTSTATUS = "botStatus";
export declare const MONGO_PATH_BOTRESULT = "botResult";
export declare const botCurrencyList: readonly ["JPY", "USD"];
export declare type botCurrency = typeof botCurrencyList[number];
export interface BaseBotParams {
    botName: string;
    logicName: string;
    baseCurrency: botCurrency;
    mongoDbName: string;
    isBackTest?: boolean;
}
export interface BaseBotStatus {
    isClear: boolean;
    isStop: boolean;
    isExit: boolean;
    message: string;
}
export declare function getBaseBotStatus(): BaseBotStatus;
export interface BaseBotResult {
    botName: string;
    logicName: string;
    updateTimestamp: string;
    cumulativeProfit: number;
    initialBadget: number;
    currentBadget: number;
    ticker: Ticker;
}
export declare function getBaseBotResult(): BaseBotResult;
