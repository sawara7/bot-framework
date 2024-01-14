import {
    BotMultiPositionClass,
    MongoPosition,
    getDefaultSendCloseOrderResult,
    getDefaultSendOpenOrderResult,
    sendCloseOrderResult,
    sendOpenOrderResult
} from "../multiPosition/"
import {
    LogicNampingClass,
    LogicNampingSettings
} from "logic-namping"
import {
    NampingBotParams
} from "./types"

export abstract class BotNampingClass extends BotMultiPositionClass {
    private _logic: LogicNampingClass

    constructor(private _nampingParams: NampingBotParams) {
        super(_nampingParams)
        this._logic = new LogicNampingClass(this._nampingParams.logicParams)
    }

    protected abstract getBadget(): Promise<number>

    protected async updateBadget(): Promise<void> {
        if (this.isBackTest) {
            this.currentBadget = this.initialBadget + this.cumulativeProfit // + this.unrealized
        } else {
            this.currentBadget = await this.getBadget()
        }
        this._logic.updateBadget(this.currentBadget)
    }

    protected abstract doSendOpenOrder(pos: MongoPosition): Promise<sendOpenOrderResult>

    protected async sendOpenOrder(pos: MongoPosition): Promise<sendOpenOrderResult> {
        const res = getDefaultSendOpenOrderResult()
        const openPrice = await this._logic.getPositionInfo(pos.openSide, pos.mongoIndex).openPrice
        if ((
            pos.openSide === "buy" &&
            this.currentTicker.ask >= openPrice &&
            openPrice > this.previousTicker.ask &&
            this.multiPositionStatistics.buyAveragePrice < this.currentTicker.ask
            ) || (
            pos.openSide === "sell" &&
            this.currentTicker.bid <= openPrice &&
            openPrice < this.previousTicker.bid &&
            this.multiPositionStatistics.sellAveragePrice > this.currentTicker.bid
            )) {
                return await this.doSendOpenOrder(pos)
        }
        return res
    }

    protected abstract doSendCloseOrder(pos: MongoPosition, force?: boolean): Promise<sendCloseOrderResult>

    protected async sendCloseOrder(pos: MongoPosition, force?: boolean): Promise<sendCloseOrderResult> {
        const res = getDefaultSendCloseOrderResult()
        if (force) {
            return await this.doSendCloseOrder(pos, true)
        }

        // take profit
        if ((
            pos.openSide === "sell" && pos.openPrice * (1 - this.logicSettings.profitRate)  > this.currentTicker.ask 
            ) || (
            pos.openSide === "buy" && pos.openPrice * (1 + this.logicSettings.profitRate) < this.currentTicker.bid
            )) {
                return await this.doSendCloseOrder(pos)
        }

        // losscut
        if ((
            pos.openSide === "sell" && pos.openPrice * (1 + this.logicSettings.losscutRate)  < this.currentTicker.ask 
            ) || (
            pos.openSide === "buy" && pos.openPrice * (1 - this.logicSettings.losscutRate) > this.currentTicker.bid
            )) {
                return await this.doSendCloseOrder(pos, true)
        }
        
        return res
    }

    protected get logic(): LogicNampingClass {
        return this._logic
    }

    protected get logicSettings(): LogicNampingSettings {
        return this._nampingParams.logicParams
    }
}