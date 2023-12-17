import { BaseBotParams } from "./params";
import { BaseBotResult } from "./types";
export interface BotStatus {
    isClaer: boolean;
    isStop: boolean;
}
export declare class BotFrameClass {
    private _baseParams;
    private _rdb;
    private _totalProfit;
    constructor(_baseParams: BaseBotParams);
    start(): Promise<void>;
    initialize(): Promise<void>;
    clearPosition(): Promise<void>;
    update(): Promise<void>;
    private setRealtimeDatabase;
    protected get isBackTest(): boolean;
    protected get totalProfit(): number;
    protected set totalProfit(value: number);
    protected getBotResult(): Promise<BaseBotResult>;
}
