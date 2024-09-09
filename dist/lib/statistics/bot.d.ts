import { TickerStatisticsCustomeParams, TickerStatisticsType } from "./types";
import { BotFrameClass } from "../base/bot";
import { Ticker } from "utils-trade";
export declare abstract class TickerStatisticsCustomeClass extends BotFrameClass {
    private _params;
    constructor(_params: TickerStatisticsCustomeParams);
    initialize(): Promise<void>;
    protected abstract updateSingleStatics(tickers: Ticker[], spans: number[]): Promise<TickerStatisticsType>;
    protected updateTicker(): Promise<void>;
    protected getTickerPath(key: string): string;
    protected getStatisticsPath(key: string): string;
    protected saveBotStatistics(): Promise<void>;
    protected updateBadget(): Promise<void>;
    protected updateTrade(): Promise<void>;
    clearPosition(): Promise<void>;
}
