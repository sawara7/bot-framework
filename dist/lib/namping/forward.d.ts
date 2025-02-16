import { MongoPosition } from "utils-trade";
import { BaseBotNampingClass } from "./base";
import { NampingBotParams } from "./types";
export declare abstract class BotNampingForwardClass extends BaseBotNampingClass {
    constructor(nampingParams: NampingBotParams);
    protected checkCancelOpenOrder(pos: MongoPosition): Promise<boolean>;
    protected checkCancelCloseOrder(pos: MongoPosition): Promise<boolean>;
    private checkCancelLimitOrder;
    protected checkOpenOrder(pos: MongoPosition): Promise<boolean>;
    protected checkCloseOrder(pos: MongoPosition): Promise<boolean>;
    private checkEnabledLimitOrder;
}
