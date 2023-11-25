export declare const botCurrencyList: readonly ["JPY", "USD"];
export type botCurrency = typeof botCurrencyList[number];
export interface BaseBotResult {
    updateTimestamp: string;
    totalProfit: string;
}
