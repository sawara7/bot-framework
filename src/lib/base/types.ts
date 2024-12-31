import { Ticker, getDefaultTicker, botCurrency } from "utils-trade";

export const MONGO_PATH_BOTSTATUS = 'botStatus'

export const MONGO_PATH_BOTRESULT = 'botResult'

export const MONGO_PATH_BOTSTATISTICS = 'botStatistics'
export interface BaseBotParams {
    botName: string
    logicName: string
    baseCurrency: botCurrency
    mongoDbName: string
    isBackTest?: boolean
    interval: number
    db: string
}

export interface BaseBotStatus {
    botName: string
    isClear: boolean
    isStop: boolean
    isExit: boolean
    message: string
    startDate: number
}

export function getBaseBotStatus(): BaseBotStatus {
    return {
        botName: '',
        isClear: false,
        isStop: false,
        isExit: false,
        message: '-',
        startDate: Date.now()
    }
}

export interface BaseBotResult {
    botName: string
    logicName: string
    updateTimestamp: string
    cumulativeProfit: number
    initialBadget: number
    currentBadget: number
    ticker: Ticker
}

export function getBaseBotResult(): BaseBotResult {
    return {
        botName: '',
        logicName: '',
        updateTimestamp: new Date().toLocaleString(),
        cumulativeProfit: 0,
        currentBadget: 0,
        initialBadget: 0,
        ticker: getDefaultTicker()
    }
}