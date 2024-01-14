import { BotMultiPositionClass, MongoPosition, sendCloseOrderResult, sendOpenOrderResult } from "../multiPosition/";
import { LogicNampingClass, LogicNampingSettings } from "logic-namping";
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
    protected get logic(): LogicNampingClass;
    protected get logicSettings(): LogicNampingSettings;
}
