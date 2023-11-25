
export const botCurrencyList = [
    'JPY',
    'USD'
    ] as const;
export type botCurrency = typeof botCurrencyList[number]

export interface BaseBotResult {
    updateTimestamp: string
    totalProfit: string
}