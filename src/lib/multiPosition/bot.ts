import { 
    getUnrealizedPL
} from "utils-trade"
import {
    ClosedOrderDict,
    MONGO_PATH_POSITIONS,
    MongoPosition,
    MongoPositionDict,
    MongoPositionRefProc,
    MultiPositionBotParams,
    MultiPositionsStatistics,
    getActiveOrdersResult,
    getClosedOrdersResult,
    getDefaultMultiPositionStatistics,
    sendCancelOrderResult,
    sendCloseOrderResult,
    sendOpenOrderResult
} from "./types"
import {
    BotFrameClass
} from "../base/bot"

export abstract class BotMultiPositionClass extends BotFrameClass {
    private _debugPositions: MongoPositionDict = {}
    private _multiPositionsStatistics : MultiPositionsStatistics = getDefaultMultiPositionStatistics()
    private _activeOrderIDs: string[] = []
    private _activeOrders: string[] = []
    private _closedOrders: ClosedOrderDict = {}

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

    protected abstract checkCancelOpenOrder(pos: MongoPosition): Promise<boolean>
    protected abstract checkCancelCloseOrder(pos: MongoPosition): Promise<boolean>

    protected async updateTrade(): Promise<void> {
        await this.updateMultiPositionStatisticsAndUpdateActiveOrders()
        const res = await this.getActiveOrders(this._activeOrderIDs)
        if (!res.success) return
        this._activeOrders = res.activeOrderIDs
        const res2 = await this.getClosedOrders(this._activeOrderIDs)
        if (!res2.success) return
        this._closedOrders = res2.closedOrders

        await this.positionLoop(
            async (pos: MongoPosition)=> {
                
                if (!pos.isOpened && !pos.isClosed && pos.openOrderID === ''){
                    // if 何もしていない
                    // do Open注文する
                    const res = await this.sendOpenOrder(pos)
                    if (res.success) {
                        pos.openOrderID = res.orderID
                        pos.openOrderType = res.orderType
                        await this.updatePosition(pos)
                    }
                    return
                }

                if (!pos.isOpened && !pos.isClosed && pos.openOrderID !== ''){
                    // if Open注文が成約したか
                    // do Open状態にする
                    // 注文リストで約定したか確認する
                    // do Open状態にする
                    if (this._activeOrders.includes(pos.openOrderID)) {
                        if (await this.checkCancelOpenOrder(pos)) {
                            const res = await this.cancelOrder(pos)
                            if (res.success) {
                                pos.openOrderID = ''
                                await this.updatePosition(pos)
                            }
                        }
                        return
                    }

                    if (Object.keys(this._closedOrders).includes(pos.openOrderID)) {
                        const od = this._closedOrders[pos.openOrderID]
                        pos.openOrderID = ''
                        pos.isOpened = true
                        pos.openPrice = od.price
                        pos.openSize = od.size
                        await this.updatePosition(pos)
                        return
                    }

                    // orderが存在しない, もしくはキャンセル
                    pos.openOrderID = ''
                    await this.updatePosition(pos)
                    return
                }

                if (pos.isOpened && !pos.isClosed && pos.closeOrderID === ''){
                    // if Open状態でClose注文していない
                    // do Close注文する
                    const res = await this.sendCloseOrder(pos)
                    if (res.success) {
                        pos.closeOrderID = res.orderID
                        pos.closeOrderType = res.orderType
                        await this.updatePosition(pos)
                    }
                    return
                }

                if (pos.isOpened && !pos.isClosed && pos.closeOrderID !== ''){
                    // if Close注文が成約したか
                    // do Close状態にする
                    if (this._activeOrders.includes(pos.closeOrderID)) {
                        if (await this.checkCancelCloseOrder(pos)) {
                            const res = await this.cancelOrder(pos)
                            if (res.success) {
                                pos.closeOrderID = ''
                                await this.updatePosition(pos)
                            }
                        }
                        return
                    }

                    if (Object.keys(this._closedOrders).includes(pos.closeOrderID)) {
                        pos.closeOrderID = ''
                        pos.isClosed = true
                        pos.closePrice = this._closedOrders[pos.closeOrderID].price
                        await this.updatePosition(pos)
                        return
                    }

                    // orderが存在しない
                    pos.closeOrderID = ''
                    await this.updatePosition(pos)
                    return
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
                    return
                }
            }
        )  
    }

    protected async clearPosition(): Promise<void> {
        await this.updateTicker()
        await this.updateMultiPositionStatisticsAndUpdateActiveOrders()
        const res = await this.getActiveOrders(this._activeOrderIDs)
        if (!res.success) return
        this._activeOrders = res.activeOrderIDs
        const res2 = await this.getClosedOrders(this._activeOrderIDs)
        if (!res2.success) return
        this._closedOrders = res2.closedOrders

        await this.positionLoop(
            async (pos: MongoPosition)=> {
                if (pos.isOpened && !pos.isClosed && pos.closeOrderID === ''){
                    // if Open状態でClose注文していない
                    // do Close注文す
                    const res = await this.sendCloseOrder(pos, true)
                    if (res.success) {
                        pos.closeOrderID = res.orderID
                        pos.closeOrderType = res.orderType
                        await this.updatePosition(pos)
                    }
                    return
                }
                if (pos.isOpened && !pos.isClosed && pos.closeOrderID !== ''){
                    // if Close注文が成約したか
                    // do Close状態にする
                    if (this._activeOrders.includes(pos.closeOrderID)) {
                        const res1 = await this.cancelOrder(pos)
                        if (res1.success) {
                            pos.closeOrderID = ''
                            await this.updatePosition(pos)
                        }
                        const res2 = await this.sendCloseOrder(pos, true)
                        if (res.success) {
                            pos.closeOrderID = res2.orderID
                            pos.closeOrderType = res2.orderType
                            await this.updatePosition(pos)
                        }
                    }
                    return
                }
            }
        )  
    }

    protected abstract getActiveOrders(orderIds: string[]): Promise<getActiveOrdersResult>
    protected abstract getClosedOrders(orderIds: string[]): Promise<getClosedOrdersResult>
    protected abstract sendOpenOrder(pos: MongoPosition): Promise<sendOpenOrderResult>
    protected abstract sendCloseOrder(pos: MongoPosition, force?: boolean): Promise<sendCloseOrderResult>
    protected abstract cancelOrder(pos: MongoPosition): Promise<sendCancelOrderResult>

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