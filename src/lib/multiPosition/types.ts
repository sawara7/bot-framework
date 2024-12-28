import { OrderSide, OrderType } from "utils-trade";
import { BaseBotParams } from "../base/types";

export const MONGO_PATH_POSITIONS = 'positions'

export interface MongoPosition {
    mongoID: string
    mongoIndex: number
    openSide: OrderSide
    openSize: number
    openPrice: number
    openOrderID: string
    openOrderType: OrderType
    closePrice: number
    closeOrderType: OrderType
    closeOrderID: string
    isOpened: boolean
    isClosed: boolean
}
export type MongoPositionRefProc = (pos: MongoPosition) => void;
export type MongoPositionDict = {[id: string]: MongoPosition}

export interface MultiPositionsStatistics {
    buySize: number
    buyPositionNum: number
    sellSize: number
    sellPositionNum: number
    unrealized: number
    buyAveragePrice: number
    sellAveragePrice: number
}

export function getDefaultMultiPositionStatistics(): MultiPositionsStatistics {
    return {
        unrealized: 0,
        buySize: 0,
        buyPositionNum: 0,
        sellSize: 0,
        sellPositionNum: 0,
        buyAveragePrice: 0,
        sellAveragePrice: 0
    }
}

export interface MultiPositionBotParams extends BaseBotParams {
    targetSides: OrderSide[],
    positionSize: number,
    feeLimitPercent: number,
    feeMarketPercent: number,
}

export interface sendOpenOrderResult {
    success: boolean
    orderID: string
    orderType: OrderType
}

export function getDefaultSendOpenOrderResult(): sendOpenOrderResult {
    return {
        success: false,
        orderID: '',
        orderType: 'limit'
    }
}

export interface sendCloseOrderResult {
    success: boolean
    orderID: string
    orderType: OrderType
}

export function getDefaultSendCloseOrderResult(): sendCloseOrderResult {
    return {
        success: false,
        orderID: '',
        orderType: 'limit'
    }
}

export interface closedOrderResult {
    price: number
    size: number
}

export interface getActiveOrdersResult {
    success: boolean
    activeOrderIDs: string[]
}

export type ClosedOrderDict = {[orderId: string]: closedOrderResult}
export interface getClosedOrdersResult {
    success: boolean
    closedOrders: ClosedOrderDict
}

export interface sendCancelOrderResult {
    success: boolean
}

