import { MongoPosition, MultiPositionBotParams, MultiPositionsStatistics } from "./types";
import { BotFrameClass } from "../base/bot";
export declare abstract class BotMultiPositionClass extends BotFrameClass {
    private _params;
    private _debugPositions;
    private _multiPositionsStatistics;
    private _activeOrderIDs;
    constructor(_params: MultiPositionBotParams);
    initialize(): Promise<void>;
    protected updateTrade(): Promise<void>;
    protected clearPosition(): Promise<void>;
    protected abstract checkActiveOrderInfo(orderIds: string[]): Promise<void>;
    protected abstract sendOpenOrder(pos: MongoPosition, force?: boolean): Promise<boolean>;
    protected abstract sendCloseOrder(pos: MongoPosition, force?: boolean): Promise<boolean>;
    protected abstract checkOpenOrder(pos: MongoPosition): Promise<boolean>;
    protected abstract checkCloseOrder(pos: MongoPosition): Promise<boolean>;
    protected abstract cancelOrder(pos: MongoPosition): Promise<boolean>;
    private updateMultiPositionStatisticsAndUpdateActiveOrders;
    private getPositions;
    private getPosition;
    private updatePosition;
    private positionLoop;
    get multiPositionStatistics(): MultiPositionsStatistics;
}
