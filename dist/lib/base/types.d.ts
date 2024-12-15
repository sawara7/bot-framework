import { Ticker, botCurrency } from "utils-trade";
export declare const MONGO_PATH_BOTSTATUS = "botStatus";
export declare const MONGO_PATH_BOTRESULT = "botResult";
export declare const MONGO_PATH_BOTSTATISTICS = "botStatistics";
export interface BaseBotParams {
    botName: string;
    logicName: string;
    baseCurrency: botCurrency;
    mongoDbName: string;
    isBackTest?: boolean;
    interval: number;
    db: string;
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
