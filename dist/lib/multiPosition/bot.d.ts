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
    protected abstract checkActiveOrderInfo(orderIds: string[]): Promise<void>;
    protected abstract sendOpenOrder(pos: MongoPosition): Promise<void>;
    protected abstract sendCloseOrder(pos: MongoPosition): Promise<void>;
    protected abstract checkOpenOrder(pos: MongoPosition): Promise<void>;
    protected abstract checkCloseOrder(pos: MongoPosition): Promise<void>;
    private updateMultiPositionStatisticsAndUpdateActiveOrders;
    private getPositions;
    private getPosition;
    private updatePosition;
    private positionLoop;
    get multiPositionStatistics(): MultiPositionsStatistics;
}
