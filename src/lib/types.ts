
export const botCurrencyList = [
    'JPY',
    'USD'
    ] as const;
export type botCurrency = typeof botCurrencyList[number]