import { MongodbManagerClass } from "utils-mongodb";
import { BaseBotParams } from "./types";
import { Ticker } from "utils-trade";
export declare abstract class BotFrameClass {
    private _baseParams;
    private _mongoDB;
    private _botStatus;
    private _previousTicker;
    private _currentTicker;
    constructor(_baseParams: BaseBotParams);
    execute(): Promise<void>;
    initialize(): Promise<void>;
    private isStopOrClearPosition;
    private getBotStatusAndIsContinue;
    private loadBotStatus;
    private saveBotStatus;
    protected loadFromMongoDB(path: string, filter?: any): Promise<any>;
    protected saveToMongoDBUpsert(path: string, data: any, filter?: any): Promise<void>;
    protected saveToMongoDBInsert(path: string, data: any, filter?: any): Promise<void>;
    abstract clearPosition(): Promise<void>;
    protected abstract updateTicker(): Promise<void>;
    protected abstract updateBadget(): Promise<void>;
    protected abstract updateTrade(): Promise<void>;
    protected get isBackTest(): boolean;
    protected get currentTicker(): Ticker;
    protected set currentTicker(tk: Ticker);
    protected get previousTicker(): Ticker;
    protected get mongoDB(): MongodbManagerClass;
}
