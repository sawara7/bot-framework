import { botCurrency } from "utils-trade";

export interface BaseBotParams {
    botName: string
    logicName: string
    baseCurrency: botCurrency
    mongoDbName: string
    isBackTest?: boolean
    interval: number
    db: string
}