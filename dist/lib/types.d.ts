export declare const botCurrencyList: readonly ["JPY", "USD"];
export type botCurrency = typeof botCurrencyList[number];
export interface BaseBotResult {
    botName: string;
    logicName: string;
    updateTimestamp: string;
    totalProfit: string;
}
