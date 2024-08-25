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
}

export interface BaseBotStatus {
    isClear: boolean
    isStop: boolean
    isExit: boolean
    message: string
}

export function getBaseBotStatus(): BaseBotStatus {
    return {
        isClear: false,
        isStop: false,
        isExit: false,
        message: '-'
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