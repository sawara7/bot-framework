import { botCurrency } from "..";

export interface BaseBotResult {
    time: number
    botID: string
    baseCurrency: botCurrency
    botLogic: string
    botName: string
    startTime: number
    uuid: string
    totalProfit: number
    hourlyProfit: number
    dailyProfit: number
    weeklyProfit: number
    unrealizedProfit: number
}
