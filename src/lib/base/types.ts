import { OrderSide } from "utils-trade";

export const MONGO_PATH_BOTSTATUS = 'botStatus'

export const MONGO_PATH_BOTRESULT = 'botResult'

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
    ticker: TickerType
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

export interface MongoPosition {
    mongoID: string,
    mongoIndex: number,
    openSide: OrderSide,
    openSize: string,
    isOpened: boolean
}
export type MongoPositionRefProc = (pos: MongoPosition) => void;