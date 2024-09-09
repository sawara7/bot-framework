import { Ticker } from "utils-trade";
import { BaseBotParams } from "../base";

export interface TickerStatisticsCustomeParams extends BaseBotParams {
    symbols: string[],
    timeSpan: number[]
}

export interface TickerStatisticsType extends Ticker {
    average: number[],
    stdv: number[],
    slope: number[],
    correlation: number[],
    sampleSize: number[]
}

export function getInitializedTickerStatistics(): TickerStatisticsType {
     return {
        ask: 0,
        bid: 0,
        currency: 'USD',
        exchange: '',
        pair: '',
        timeStamp: 0,
        average: [],
        correlation: [],
        slope: [],
        stdv: [],
        sampleSize: []
     }
}