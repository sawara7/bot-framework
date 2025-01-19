import { MongoPosition } from "utils-trade"
import { BaseBotNampingClass } from "./base"
import { NampingBotParams } from "./types"

export abstract class BotNampingReverseClass extends BaseBotNampingClass {
    constructor(nampingParams: NampingBotParams) {
        super(nampingParams)
    }

    protected async checkCancelOpenOrder(pos: MongoPosition): Promise<boolean> {
        return false
    }

    protected async checkCancelCloseOrder(pos: MongoPosition): Promise<boolean> {
        return false
    }
    
    protected async checkOpenOrder(pos: MongoPosition): Promise<boolean> {
        const openPrice = await this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).openPrice
        if ((
            pos.openSide === "buy" &&
            this.currentTicker.ask >= openPrice &&
            openPrice > this.previousTicker.ask &&
            this.buyAveragePrice < this.currentTicker.ask
            ) || (
            pos.openSide === "sell" &&
            this.currentTicker.bid <= openPrice &&
            openPrice < this.previousTicker.bid &&
            this.sellAveragePrice > this.currentTicker.bid
            )) {
                return true
        }
        return false
    }

    protected async checkCloseOrder(pos: MongoPosition): Promise<boolean> {
        // take profit
        const closePrice = this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).closePrice
        if ((
            pos.openSide === "sell" && closePrice > this.currentTicker.ask 
            ) || (
            pos.openSide === "buy" && closePrice < this.currentTicker.bid
            )) {
                return true
        }
        return false      
    }
}