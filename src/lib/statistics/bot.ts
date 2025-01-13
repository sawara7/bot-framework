import {
    TickerStatisticsCustomeParams,
    TickerStatisticsType,
} from "./types"
import {
    BotFrameClass
} from "../base/bot"
import { Ticker } from "utils-trade"
import {
    MONGODB_TABLE_STATISTICS,
    getTickerPath
} from "../.."
import { floor } from "utils-general"

export  abstract class TickerStatisticsCustomeClass extends BotFrameClass {
    constructor(private _params: TickerStatisticsCustomeParams) {
        super(_params)
    }

    async initialize(): Promise<void> {
        await super.initialize()
    }

    protected abstract updateSingleStatics(tickers: Ticker[], spans: number[]): TickerStatisticsType 

    protected async updateTicker(): Promise<void> {
        const maxSpan = Math.max(...this._params.timeSpan)
        const timestamp = Date.now()
        const minTimestamp = timestamp - maxSpan
        const ress:{[pair: string]: any} = {}
        for (const k of this._params.symbols) {
            const tks = await this.mongoDB.find(
                getTickerPath(k), {
                        timeStamp: {
                            $gt: minTimestamp
                        }
                    }
                )
            if (tks.result && tks.data && tks.data as Ticker[] && tks.data.length > 2){
                const tk = tks.data[0] as Ticker
                const res = this.updateSingleStatics((await tks).data as Ticker[], this._params.timeSpan)
                res.pair = tk.pair
                res.timeStamp = Date.now()
                ress[res.pair] = res
                res.ask = floor(tk.ask, 2)
                res.bid = floor(tk.bid, 2)
                for (const i in res.average) {
                    res.average[i] = floor(res.average[i], 2)
                }
                for (const i in res.correlation) {
                    res.correlation[i] = floor(res.correlation[i], 2)
                }
                for (const i in res.stdv) {
                    res.stdv[i] = floor(res.stdv[i], 2)
                }
                for (const i in res.slope) {
                    res.slope[i] = floor(res.slope[i], 2)
                }
                await this.saveToMongoDBUpsert(MONGODB_TABLE_STATISTICS, res, {pair: tk.pair})
            }
        }
    }

    protected async saveBotStatistics(): Promise<void> {
        // do nothing
    }

    protected async updateBadget(): Promise<void> {
        this.currentBadget = 1
    }

    protected async updateTrade(): Promise<void> {
        // do nothing
    }

    async clearPosition(): Promise<void> {
        // do nothing      
    }
}