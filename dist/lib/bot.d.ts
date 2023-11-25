import { BaseBotParams } from "./params";
import { BaseBotResult } from "./types";
export declare class BotFrameClass {
    private _params;
    private _rdb;
    constructor(_params: BaseBotParams);
    start(): Promise<void>;
    protected initialize(): Promise<void>;
    protected update(): Promise<void>;
    private setRealtimeDatabase;
    protected get isBackTest(): boolean;
    protected get botResult(): BaseBotResult;
}
