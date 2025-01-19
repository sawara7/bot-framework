import { BaseBotParams } from "../base";

export interface TickerStatisticsCustomeParams extends BaseBotParams {
    symbols: string[],
    timeSpan: number[]
}