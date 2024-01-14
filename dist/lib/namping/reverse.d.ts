import { MongoPosition } from "../multiPosition";
import { BaseBotNampingClass } from "./base";
import { NampingBotParams } from "./types";
export declare abstract class BotNampingReverseClass extends BaseBotNampingClass {
    constructor(nampingParams: NampingBotParams);
    protected checkCancelOpenOrder(pos: MongoPosition): Promise<boolean>;
    protected checkCancelCloseOrder(pos: MongoPosition): Promise<boolean>;
    protected checkOpenOrder(pos: MongoPosition): Promise<boolean>;
    protected checkCloseOrder(pos: MongoPosition): Promise<boolean>;
    protected checkLosscutOrder(pos: MongoPosition): Promise<boolean>;
}
