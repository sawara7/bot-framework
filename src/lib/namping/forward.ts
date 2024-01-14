import { MongoPosition } from "../multiPosition"
import { BaseBotNampingClass } from "./base"
import { NampingBotParams } from "./types"

export abstract class BotNampingForwardClass extends BaseBotNampingClass {
    constructor(nampingParams: NampingBotParams) {
        super(nampingParams)
    }

    protected async checkCancelOpenOrder(pos: MongoPosition): Promise<boolean> {
        const openPrice = await this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).openPrice
        if ((
            pos.openSide === "buy" && openPrice * (1+this.logicSettings.profitRate * 2) < this.previousTicker.ask
            ) || (
            pos.openSide === "sell" && openPrice * (1-this.logicSettings.profitRate * 2) > this.previousTicker.bid
            )) {
                return true
        }
        return false
    }

    protected async checkCancelCloseOrder(pos: MongoPosition): Promise<boolean> {
        const closePrice = this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).closePrice
        if ((
            pos.openSide === "buy" && closePrice * (1+this.logicSettings.profitRate * 2) < this.currentTicker.ask
            ) || (
            pos.openSide === "sell" && closePrice * (1-this.logicSettings.profitRate * 2) > this.currentTicker.bid
            )) {
                return true
        }
        return false
    }
    
    protected async checkOpenOrder(pos: MongoPosition): Promise<boolean> {
        const openPrice = await this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).openPrice
        if ((
            pos.openSide === "buy" &&
            openPrice <= this.currentTicker.ask &&
            openPrice >= this.currentTicker.ask * (1-this.logicSettings.profitRate * 1.5)
            ) || (
            pos.openSide === "sell" &&
            openPrice >= this.currentTicker.bid &&
            openPrice <= this.currentTicker.bid * (1+this.logicSettings.profitRate * 1.5)
            )) {
                return true
        }
        return false
    }

    protected async checkCloseOrder(pos: MongoPosition): Promise<boolean> {
        const closePrice = this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).closePrice
        if ((
            pos.openSide === "sell" &&
            closePrice <= this.currentTicker.ask &&
            closePrice >= this.currentTicker.ask * (1-this.logicSettings.profitRate * 1.5)
            ) || (
            pos.openSide === "buy" &&
            closePrice >= this.currentTicker.bid &&
            closePrice <= this.currentTicker.bid * (1+this.logicSettings.profitRate * 1.5)
            )) {
                return true
        }
        return false     
    }

    protected async checkLosscutOrder(pos: MongoPosition): Promise<boolean> {
        const losscutPrice = this.logic.getPositionInfo(pos.openSide, pos.mongoIndex).losscutPrice
        if ((
            pos.openSide === "sell" &&
            losscutPrice < this.currentTicker.ask
            ) || (
            pos.openSide === "buy" &&
            losscutPrice > this.currentTicker.bid
            )) {
                return true
        }
        return false 
    }
    
}