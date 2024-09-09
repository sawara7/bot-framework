import { Ticker } from "utils-trade";
import { BaseBotParams } from "../base";
export interface TickerStatisticsCustomeParams extends BaseBotParams {
    symbols: string[];
    timeSpan: number[];
}
export interface TickerStatisticsType extends Ticker {
    average: number[];
    stdv: number[];
    slope: number[];
    correlation: number[];
    sampleSize: number[];
}
export declare function getInitializedTickerStatistics(): TickerStatisticsType;
