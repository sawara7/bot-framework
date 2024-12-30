import { OrderSide, OrderType } from "utils-trade";
import { BaseBotParams } from "../base/types";
export declare const MONGO_PATH_POSITIONS = "positions";
export interface MongoPosition {
    mongoID: string;
    mongoIndex: number;
    openSide: OrderSide;
    openSize: number;
    openPrice: number;
    openOrderID: string;
    openOrderType: OrderType;
    closePrice: number;
    closeOrderType: OrderType;
    closeOrderID: string;
    isOpened: boolean;
    isClosed: boolean;
}
export type MongoPositionRefProc = (pos: MongoPosition) => void;
export type MongoPositionDict = {
    [id: string]: MongoPosition;
};
export interface MultiPositionsStatistics {
    buySize: number;
    buyPositionNum: number;
    sellSize: number;
    sellPositionNum: number;
    unrealized: number;
    buyAveragePrice: number;
    sellAveragePrice: number;
}
export declare function getDefaultMultiPositionStatistics(): MultiPositionsStatistics;
export interface MultiPositionBotParams extends BaseBotParams {
    targetSides: OrderSide[];
    positionSize: number;
    feeLimitPercent: number;
    feeMarketPercent: number;
}
export interface sendOpenOrderResult {
    success: boolean;
    orderID: string;
    orderType: OrderType;
}
export declare function getDefaultSendOpenOrderResult(): sendOpenOrderResult;
export interface sendCloseOrderResult {
    success: boolean;
    orderID: string;
    orderType: OrderType;
}
export declare function getDefaultSendCloseOrderResult(): sendCloseOrderResult;
export interface closedOrderResult {
    price: number;
    size: number;
}
export interface getActiveOrdersResult {
    success: boolean;
    activeOrderIDs: string[];
}
export type ClosedOrderDict = {
    [orderId: string]: closedOrderResult;
};
export interface getClosedOrdersResult {
    success: boolean;
    closedOrders: ClosedOrderDict;
}
export interface sendCancelOrderResult {
    success: boolean;
}
