export declare const botCurrencyList: readonly ["JPY", "USD"];
export type botCurrency = typeof botCurrencyList[number];
export interface BaseBotParams {
    botName: string;
    logicName: string;
    baseCurrency: botCurrency;
    dbName: string;
    useRealtimeDB: boolean;
    useMongoDBAndDBName?: string;
    isBackTest?: boolean;
}
export interface BaseBotResult {
    botName: string;
    logicName: string;
    updateTimestamp: string;
    cumulativeProfit: string;
    initialBadget: string;
    currentBadget: string;
    ticker: TickerType;
}
export interface TickerType {
    ask: number;
    bid: number;
}
export declare function getDefaultTicker(): TickerType;
export interface BaseBotStatus {
    isClear: boolean;
    isStop: boolean;
    isExit: boolean;
}
export declare function getBaseBotStatus(): BaseBotStatus;
