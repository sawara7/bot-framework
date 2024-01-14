import {
    BotMultiPositionClass,
    MongoPosition,
    getDefaultSendCloseOrderResult,
    getDefaultSendOpenOrderResult,
    sendCloseOrderResult,
    sendOpenOrderResult
} from "../multiPosition"
import {
    LogicNampingClass,
    LogicNampingSettings
} from "logic-namping"
import {
    NampingBotParams
} from "./types"

export abstract class BaseBotNampingClass extends BotMultiPositionClass {
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
    
    protected abstract checkOpenOrder(pos: MongoPosition): Promise<boolean>

    protected async sendOpenOrder(pos: MongoPosition): Promise<sendOpenOrderResult> {
        if (await this.checkOpenOrder(pos)) return await this.doSendOpenOrder(pos)
        return getDefaultSendOpenOrderResult()
    }

    protected abstract doSendCloseOrder(pos: MongoPosition, force?: boolean): Promise<sendCloseOrderResult>

    protected abstract checkCloseOrder(pos: MongoPosition): Promise<boolean>

    protected abstract checkLosscutOrder(pos: MongoPosition): Promise<boolean>

    protected async sendCloseOrder(pos: MongoPosition, force?: boolean): Promise<sendCloseOrderResult> {
        const res = getDefaultSendCloseOrderResult()
        if (force) {
            return await this.doSendCloseOrder(pos, true)
        }

        // take profit
        if (await this.checkCloseOrder(pos)) return await this.doSendCloseOrder(pos)

        // losscut
        if (await this.checkLosscutOrder(pos)) return await this.doSendCloseOrder(pos, true)
        
        return res
    }

    protected get logic(): LogicNampingClass {
        return this._logic
    }

    protected get logicSettings(): LogicNampingSettings {
        return this._nampingParams.logicParams
    }
}