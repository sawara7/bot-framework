import { TickerCollectorCustomeClassParams } from "./types";
import { BotFrameClass } from "../base/bot";
export declare abstract class TickerCollectorCustomeClass extends BotFrameClass {
    private _params;
    constructor(_params: TickerCollectorCustomeClassParams);
    initialize(): Promise<void>;
    protected abstract updateSingleTicker(key: string): Promise<void>;
    protected updateTicker(): Promise<void>;
    protected getTickerPath(key: string): string;
    protected saveBotStatistics(): Promise<void>;
    protected updateBadget(): Promise<void>;
    protected updateTrade(): Promise<void>;
    clearPosition(): Promise<void>;
}
