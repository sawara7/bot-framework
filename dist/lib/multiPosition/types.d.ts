import { OrderSide, OrderType } from "utils-trade";
import { BaseBotParams } from "../base/types";
export declare const MONGO_PATH_POSITIONS = "Positions";
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
export declare type MongoPositionRefProc = (pos: MongoPosition) => void;
export declare type MongoPositionDict = {
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
}
