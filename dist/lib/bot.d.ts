import { BaseBotParams } from "./params";
import { BaseBotResult } from "./types";
export declare class BotFrameClass {
    private _baseParams;
    private _rdb;
    constructor(_baseParams: BaseBotParams);
    start(): Promise<void>;
    protected initialize(): Promise<void>;
    protected update(): Promise<void>;
    private setRealtimeDatabase;
    protected get isBackTest(): boolean;
    protected getBotResult(): Promise<BaseBotResult>;
}
