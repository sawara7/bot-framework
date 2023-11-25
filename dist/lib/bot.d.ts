import { BaseBotParams } from "./params";
export declare class BotFrameClass {
    private _params;
    private _rdb;
    private _result;
    constructor(_params: BaseBotParams);
    initialize(): Promise<void>;
    start(): Promise<void>;
    update(): Promise<void>;
    setRealtimeDatabase(): Promise<void>;
}
