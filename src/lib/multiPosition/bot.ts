import { getUnrealizedPL } from "utils-trade"
import { MONGO_PATH_POSITIONS, MongoPosition, MongoPositionDict, MongoPositionRefProc, MultiPositionBotParams, MultiPositionsStatistics, getDefaultMultiPositionStatistics } from "./types"
import { BotFrameClass } from "../base/bot"

export abstract class BotMultiPositionClass extends BotFrameClass {
    private _debugPositions: MongoPositionDict = {}
    private _multiPositionsStatistics : MultiPositionsStatistics = getDefaultMultiPositionStatistics()
    private _activeOrderIDs: string[] = []

    constructor(private _params: MultiPositionBotParams) {
        super(_params)
    }

    async initialize(): Promise<void> {
        await super.initialize()
        for (const s of this._params.targetSides) {
            for (let i = 0; i < this._params.positionSize; i++) {
                const data = await this.getPosition(s+i)
                if (data.length === 0) {
                    const mongoPos: MongoPosition = {
                        mongoID: s+i,
                        mongoIndex: i,
                        isOpened: false,
                        isClosed: false,
                        openSide: s,
                        openSize: 0,
                        openPrice: 0,
                        openOrderType: 'limit',
                        openOrderID: '',
                        closePrice: 0,
                        closeOrderType: 'limit',
                        closeOrderID: ''
                    }
                    if (this.isBackTest) {
                        this._debugPositions[s+i] = mongoPos
                    } else {
                        await this.mongoDB.insert(MONGO_PATH_POSITIONS, mongoPos)
                    }
                }
            }
        }
    }

    protected async updateTrade(): Promise<void> {
        await this.updateMultiPositionStatisticsAndUpdateActiveOrders()
        await this.checkActiveOrderInfo(this._activeOrderIDs)
        await this.positionLoop(
            async (pos: MongoPosition)=> {
                if (!pos.isOpened && !pos.isClosed && pos.openOrderID === ''){
                    // if 何もしていない
                    // do Open注文する
                    await this.sendOpenOrder(pos)
                    if (pos.openOrderID !== '') await this.updatePosition(pos)
                }
                if (!pos.isOpened && !pos.isClosed && pos.openOrderID !== ''){
                    // if Open注文が成約したか
                    // do Open状態にする
                    // 注文リストで約定したか確認する
                    // do Open状態にする
                    await this.checkOpenOrder(pos)
                    if (pos.openSize > 0 && pos.openPrice > 0) {
                        pos.openOrderID = ''
                        pos.isOpened = true
                        await this.updatePosition(pos)
                    }
                }
                if (pos.isOpened && !pos.isClosed && pos.closeOrderID === ''){
                    // if Open状態でClose注文していない
                    // do Close注文する
                    await this.sendCloseOrder(pos)
                    if (pos.closeOrderID !== '') await this.updatePosition(pos)
                }
                if (pos.isOpened && !pos.isClosed && pos.closeOrderID !== ''){
                    // if Close注文が成約したか
                    // do Close状態にする
                    await this.checkCloseOrder(pos)
                    if (pos.closePrice > 0) {
                        pos.closeOrderID = ''
                        pos.isClosed = true
                        await this.updatePosition(pos)
                    }
                }
                if (pos.isOpened && pos.isClosed){
                    // if Positionが完了した
                    // do Positionをリセットする
                    this.cumulativeProfit += getUnrealizedPL(pos.openSide, this.currentTicker, pos.openPrice, pos.openSize)
                    pos.isOpened = false
                    pos.isClosed = false
                    pos.closePrice = 0
                    pos.openPrice = 0
                    pos.openSize = 0
                    await this.updatePosition(pos)
                }
            }
        )  
    }

    protected abstract checkActiveOrderInfo(orderIds: string[]): Promise<void>
    protected abstract sendOpenOrder(pos: MongoPosition): Promise<void>
    protected abstract sendCloseOrder(pos: MongoPosition): Promise<void>
    protected abstract checkOpenOrder(pos: MongoPosition): Promise<void>
    protected abstract checkCloseOrder(pos: MongoPosition): Promise<void>

    private async updateMultiPositionStatisticsAndUpdateActiveOrders(): Promise<void> {
        let result = getDefaultMultiPositionStatistics()
        let buyCap = 0
        let sellCap = 0
        this._activeOrderIDs = []
        await this.positionLoop(
            async (pos: MongoPosition)=> {
                if (!pos.isOpened) return
                if (pos.isClosed) return
                if (pos.openOrderID !== '') this._activeOrderIDs.push(pos.openOrderID)
                if (pos.closeOrderID !== '') this._activeOrderIDs.push(pos.closeOrderID)
                if (pos.openSide === "buy") {
                    result.buySize += pos.openSize
                    buyCap += (pos.openSize * pos.openPrice)
                    result.buyPositionNum++
                } else if (pos.openSide === "sell") {
                    result.sellSize += pos.openSize
                    sellCap += (pos.openSize * pos.openPrice)
                    result.sellPositionNum++  
                }
                result.unrealized += getUnrealizedPL(pos.openSide, this.currentTicker, pos.openPrice, pos.openSize)
            }
        )
        result.buyAveragePrice = result.buySize > 0? buyCap / result.buySize: 0
        result.sellAveragePrice = result.sellSize > 0? sellCap / result.sellSize: 1000000000
        this._multiPositionsStatistics = result
    }

    private async getPositions(): Promise<MongoPositionDict> {
        if (!this.isBackTest) {
            const result: MongoPositionDict = {}
            const res = await this.mongoDB.find(MONGO_PATH_POSITIONS)
            if (!res.result || !res.data) throw new Error('get positions error')
            for (const pos of res.data as MongoPosition[]) {
                result[pos.mongoID] = pos
            }
            return result
        }
        return this._debugPositions
    }

    private async getPosition(id: string): Promise<MongoPosition[]> {
        if (!this.isBackTest) {
            const res = await this.mongoDB.find(MONGO_PATH_POSITIONS, {mongoID: id})
            const data = res.data as MongoPosition[]
            return data
        }
        if (this._debugPositions[id]) return [this._debugPositions[id]]
        return []
    }

    private async updatePosition(pos: MongoPosition): Promise<void> {
        if (!this.isBackTest){
            await this.mongoDB.update(MONGO_PATH_POSITIONS, {mongoID: pos.mongoID}, pos)
        } else {
            this._debugPositions[pos.mongoID] = pos
        }
    }

    private async positionLoop( proc: MongoPositionRefProc) {
        const positions = await this.getPositions()
        for (const s of this._params.targetSides) {
            for (let i = 0; i <= this._params.positionSize - 1; i++) {
                const pos = positions[s+i]
                if (pos) await proc(pos)
            }
        }
    }

    get multiPositionStatistics(): MultiPositionsStatistics {
        return this._multiPositionsStatistics
    }

}