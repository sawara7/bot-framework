import { botCurrency } from "./types"

export interface BaseBotParams {
    botName: string
    logicName: string
    baseCurrency: botCurrency
    dbName: string
    isBackTest?: boolean
}