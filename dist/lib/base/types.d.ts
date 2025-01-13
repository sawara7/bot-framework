import { Ticker, botCurrency } from "utils-trade";
export declare const MONGODB_DB_BOTSTATUS = "botStatus";
export declare const MONGODB_TABLE_BOTSTATUS = "status";
export declare const MONGODB_TABLE_BOTRESULT = "result";
export declare const MONGODB_TABLE_TICKER = "ticker";
export declare const MONGODB_TABLE_STATISTICS = "statistics";
export declare const MONGODB_TABLE_CUMULATIVEPL = "cumulativePL";
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
    botName: string;
    isClear: boolean;
    isStop: boolean;
    isExit: boolean;
    message: string;
    startDate: number;
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
export declare function getTickerPath(key: string): string;
