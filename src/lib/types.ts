
export const botCurrencyList = [
    'JPY',
    'USD'
    ] as const;
export type botCurrency = typeof botCurrencyList[number]

export interface BaseBotResult {
    botName: string
    logicName: string
    updateTimestamp: string
    totalProfit: string
}