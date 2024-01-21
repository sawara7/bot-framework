import { MongoPosition, MultiPositionBotParams, MultiPositionsStatistics, getActiveOrdersResult, getClosedOrdersResult, sendCancelOrderResult, sendCloseOrderResult, sendOpenOrderResult } from "./types";
import { BotFrameClass } from "../base/bot";
export declare abstract class BotMultiPositionClass extends BotFrameClass {
    private _params;
    private _debugPositions;
    private _multiPositionsStatistics;
    private _activeOrderIDs;
    private _activeOrders;
    private _closedOrders;
    constructor(_params: MultiPositionBotParams);
    initialize(): Promise<void>;
    protected abstract checkCancelOpenOrder(pos: MongoPosition): Promise<boolean>;
    protected abstract checkCancelCloseOrder(pos: MongoPosition): Promise<boolean>;
    protected updateTrade(): Promise<void>;
    protected clearPosition(): Promise<void>;
    protected abstract getActiveOrders(orderIds: string[]): Promise<getActiveOrdersResult>;
    protected abstract getClosedOrders(orderIds: string[]): Promise<getClosedOrdersResult>;
    protected abstract sendOpenOrder(pos: MongoPosition): Promise<sendOpenOrderResult>;
    protected abstract sendCloseOrder(pos: MongoPosition, force?: boolean): Promise<sendCloseOrderResult>;
    protected abstract cancelOrder(pos: MongoPosition): Promise<sendCancelOrderResult>;
    private updateMultiPositionStatisticsAndUpdateActiveOrders;
    private getPositions;
    private getPosition;
    private updatePosition;
    private positionLoop;
    protected saveBotStatistics(): Promise<void>;
    get multiPositionStatistics(): MultiPositionsStatistics;
}
