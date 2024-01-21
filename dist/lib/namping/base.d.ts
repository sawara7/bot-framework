import { BotMultiPositionClass, MongoPosition, sendCloseOrderResult, sendOpenOrderResult } from "../multiPosition";
import { LogicNampingClass, LogicNampingSettings } from "logic-namping";
import { NampingBotParams } from "./types";
export declare abstract class BaseBotNampingClass extends BotMultiPositionClass {
    private _nampingParams;
    private _logic;
    constructor(_nampingParams: NampingBotParams);
    protected abstract getBadget(): Promise<number>;
    protected updateBadget(): Promise<void>;
    protected abstract doSendOpenOrder(pos: MongoPosition): Promise<sendOpenOrderResult>;
    protected abstract checkOpenOrder(pos: MongoPosition): Promise<boolean>;
    protected sendOpenOrder(pos: MongoPosition): Promise<sendOpenOrderResult>;
    protected abstract doSendCloseOrder(pos: MongoPosition, force?: boolean): Promise<sendCloseOrderResult>;
    protected abstract checkCloseOrder(pos: MongoPosition): Promise<boolean>;
    protected sendCloseOrder(pos: MongoPosition, force?: boolean): Promise<sendCloseOrderResult>;
    protected checkLosscutOrder(pos: MongoPosition): Promise<boolean>;
    protected get nampingParams(): NampingBotParams;
    protected get logic(): LogicNampingClass;
    protected get logicSettings(): LogicNampingSettings;
}
