import { OrderSide } from "utils-trade"
import { MongoPosition } from "../multiPosition"
import { BaseBotNampingClass } from "./base"
import { NampingBotParams } from "./types"

export abstract class BotNampingForwardClass extends BaseBotNampingClass {
    constructor(nampingParams: NampingBotParams) {
        super(nampingParams)
    }

    protected async checkCancelOpenOrder(pos: MongoPosition): Promise<boolean> {
        const openPrice = await this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).openPrice
        return this.checkCancelLimitOrder(openPrice, pos.openSide)
    }

    protected async checkCancelCloseOrder(pos: MongoPosition): Promise<boolean> {
        const closePrice = this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).closePrice
        return this.checkCancelLimitOrder(closePrice, pos.openSide === "buy"? "sell": "buy")
    }

    private checkCancelLimitOrder(price: number, side: OrderSide) {
        if ((
            side === "buy" && price < this.previousTicker.ask * (1-this.nampingParams.limitOrderLowerRate * 1.1)
            ) || (
            side === "sell" && price > this.previousTicker.bid * (1+this.nampingParams.limitOrderUpperRate * 1.1)
            )) {
                return true
        }
        return false  
    }
    
    protected async checkOpenOrder(pos: MongoPosition): Promise<boolean> {
        const openPrice = await this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).openPrice
        return this.checkEnabledLimitOrder(openPrice, pos.openSide)
    }

    protected async checkCloseOrder(pos: MongoPosition): Promise<boolean> {
        const closePrice = this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).closePrice
        return this.checkEnabledLimitOrder(closePrice, pos.openSide === "buy"? "sell": "buy") 
    }

    private checkEnabledLimitOrder(price: number, side: OrderSide): boolean {
        if ((
            side === "buy" &&
            price <= this.currentTicker.ask &&
            price >= this.currentTicker.ask * (1-this.nampingParams.limitOrderLowerRate)
            ) || (
            side === "sell" &&
            price >= this.currentTicker.bid &&
            price <= this.currentTicker.bid * (1+this.nampingParams.limitOrderUpperRate)
            )) {
                return true
        }
        return false 
    }
}