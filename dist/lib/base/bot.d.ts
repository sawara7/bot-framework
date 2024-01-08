import { MongodbManagerClass } from "utils-mongodb";
import { Ticker } from "utils-trade";
import { BaseBotParams, BaseBotResult } from "./types";
export declare abstract class BotFrameClass {
    private _baseParams;
    private _realtimeDB;
    private _mongoDB;
    private _botStatus;
    private _botResult;
    private _previousTicker;
    private _currentTicker;
    constructor(_baseParams: BaseBotParams);
    start(): Promise<void>;
    protected initialize(): Promise<void>;
    private isStopOrClearPosition;
    private getBotStatusFromRealtimeDbAndIsContinue;
    private loadBotStatus;
    private saveBotStatus;
    private loadBotResult;
    private saveBotResult;
    protected loadFromMongoDB(path: string, filter?: any): Promise<any>;
    protected saveToMongoDB(path: string, data: any, filter?: any): Promise<void>;
    protected abstract clearPosition(): Promise<void>;
    protected abstract updateTicker(): Promise<void>;
    protected abstract updateBadget(): Promise<void>;
    protected abstract updateTrade(): Promise<void>;
    private loadFromRealtimeDB;
    private saveToRealtimeDB;
    protected get isBackTest(): boolean;
    protected get botResult(): BaseBotResult;
    protected get cumulativeProfit(): number;
    protected set cumulativeProfit(value: number);
    protected get currentBadget(): number;
    protected set currentBadget(badget: number);
    protected get initialBadget(): number;
    protected get currentTicker(): Ticker;
    protected set currentTicker(tk: Ticker);
    protected get previousTicker(): Ticker;
    protected get mongoDB(): MongodbManagerClass;
}
