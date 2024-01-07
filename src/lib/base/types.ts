
export const botCurrencyList = [
    'JPY',
    'USD'
    ] as const;
export type botCurrency = typeof botCurrencyList[number]

export interface BaseBotParams {
    botName: string
    logicName: string
    baseCurrency: botCurrency
    dbName: string
    useRealtimeDB: boolean
    useMongoDBAndDBName?: string
    isBackTest?: boolean
}

export interface BaseBotResult {
    botName: string
    logicName: string
    updateTimestamp: string
    cumulativeProfit: string
    initialBadget: string
    currentBadget: string
    ticker: TickerType
}

export interface TickerType {
    ask: number
    bid: number
}

export function getDefaultTicker(): TickerType {
    return {
        ask: 0,
        bid: 0
    }
}

export interface BaseBotStatus {
    isClear: boolean
    isStop: boolean
    isExit: boolean
}

export function getBaseBotStatus(): BaseBotStatus {
    return {
        isClear: false,
        isStop: false,
        isExit: false
    }
}