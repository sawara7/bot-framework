import { TickerCollectorCustomeClassParams } from "./types";
import { BotFrameClass } from "../base/bot";
import { Ticker } from "utils-trade";
export declare abstract class TickerCollectorCustomeClass extends BotFrameClass {
    private _params;
    constructor(_params: TickerCollectorCustomeClassParams);
    initialize(): Promise<void>;
    protected abstract updateSingleTicker(key: string): Promise<Ticker>;
    protected updateTicker(): Promise<void>;
    protected updateBadget(): Promise<void>;
    protected updateTrade(): Promise<void>;
    clearPosition(): Promise<void>;
}
