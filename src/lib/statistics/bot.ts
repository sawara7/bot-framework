import {
    TickerStatisticsCustomeParams, TickerStatisticsType,
} from "./types"
import {
    BotFrameClass
} from "../base/bot"
import { Ticker } from "utils-trade"

const MONGO_PATH_TICKER = 'ticker'
const MONGO_PATH_STATISTICS = 'statistics'

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
        for (const k of this._params.symbols) {
            const tks = await this.mongoDB.find(
                this.getTickerPath(k), {
                        timeStamp: {
                            $gt: minTimestamp
                        }
                    }
                )
            if (tks.result && tks.data && tks.data as Ticker[] && tks.data.length > 2){
                const tk = tks.data[0] as Ticker
                const res = this.updateSingleStatics((await tks).data as Ticker[], this._params.timeSpan)
                res.pair = tk.pair
                await this.saveToMongoDB(MONGO_PATH_STATISTICS, res, {pair: tk.pair})
            }
        }  
    }

    protected getTickerPath(key: string): string {
        return MONGO_PATH_TICKER + '/' + key
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