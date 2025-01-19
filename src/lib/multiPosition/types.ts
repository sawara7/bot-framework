import { OrderSide, OrderType } from "utils-trade";
import { BaseBotParams } from "../base/types";

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