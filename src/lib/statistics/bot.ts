import {
    TickerStatisticsCustomeParams, TickerStatisticsType,
} from "./types"
import {
    BotFrameClass
} from "../base/bot"
import { Ticker } from "utils-trade"

const MONGO_PATH_TICKER = 'ticker'

export  abstract class TickerStatisticsCustomeClass extends BotFrameClass {
    constructor(private _params: TickerStatisticsCustomeParams) {
        super(_params)
    }

    async initialize(): Promise<void> {
        await super.initialize()
    }

    protected abstract updateSingleStatics(tickers: Ticker[], spans: number[]): Promise<TickerStatisticsType> 

    protected async updateTicker(): Promise<void> {
        const maxSpan = Math.max(...this._params.timeSpan)
        const minTimestamp = Date.now() - maxSpan
        for (const k of this._params.symbols) {
            const tks = await this.mongoDB.find(this.getTickerPath(k), {
                timeStamp: {
                    $gt: minTimestamp
                }
            })
            if (tks.result && tks.data as Ticker[]){
                const res = this.updateSingleStatics((await tks).data as Ticker[], this._params.timeSpan)
                await this.saveToMongoDB(this.getTickerPath(k), res)
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