import { MongoPosition } from "../multiPosition"
import { BaseBotNampingClass } from "./base"
import { NampingBotParams } from "./types"

export abstract class BotNampingForwardClass extends BaseBotNampingClass {
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
            this.currentTicker.ask >= openPrice && openPrice > this.previousTicker.ask
            ) || (
            pos.openSide === "sell" &&
            this.currentTicker.bid <= openPrice && openPrice < this.previousTicker.bid
            )) {
                return true
        }
        return false
    }

    protected async checkCloseOrder(pos: MongoPosition): Promise<boolean> {
        // take profit
        if ((
            pos.openSide === "sell" && pos.openPrice * (1 - this.logicSettings.profitRate)  > this.currentTicker.ask 
            ) || (
            pos.openSide === "buy" && pos.openPrice * (1 + this.logicSettings.profitRate) < this.currentTicker.bid
            )) {
                return true
        }
        return false      
    }

    protected async checkLosscutOrder(pos: MongoPosition): Promise<boolean> {
        // losscut
        if ((
            pos.openSide === "sell" && pos.openPrice * (1 + this.logicSettings.losscutRate)  < this.currentTicker.ask 
            ) || (
            pos.openSide === "buy" && pos.openPrice * (1 - this.logicSettings.losscutRate) > this.currentTicker.bid
            )) {
                return true
        } 
        return false
    }
    
}