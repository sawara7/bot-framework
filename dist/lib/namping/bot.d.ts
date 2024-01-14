import { BotMultiPositionClass, MongoPosition, sendCloseOrderResult, sendOpenOrderResult } from "../multiPosition/";
import { NampingBotParams } from "./types";
export declare abstract class BotNampingClass extends BotMultiPositionClass {
    private _nampingParams;
    private _logic;
    constructor(_nampingParams: NampingBotParams);
    protected abstract getBadget(): Promise<number>;
    protected updateBadget(): Promise<void>;
    protected abstract doSendOpenOrder(pos: MongoPosition): Promise<sendOpenOrderResult>;
    protected sendOpenOrder(pos: MongoPosition): Promise<sendOpenOrderResult>;
    protected abstract doSendCloseOrder(pos: MongoPosition, force?: boolean): Promise<sendCloseOrderResult>;
    protected sendCloseOrder(pos: MongoPosition, force?: boolean): Promise<sendCloseOrderResult>;
    private get logicSettings();
}
