import {
    TickerCollectorCustomeClassParams,
} from "./types"
import {
    BotFrameClass
} from "../base/bot"
import { Ticker } from "utils-trade"

const MONGO_PATH_TICKER = 'ticker'

export  abstract class TickerCollectorCustomeClass extends BotFrameClass {
    constructor(private _params: TickerCollectorCustomeClassParams) {
        super(_params)
    }

    async initialize(): Promise<void> {
        await super.initialize()
    }

    protected abstract updateSingleTicker(key: string): Promise<Ticker> 

    protected async updateTicker(): Promise<void> {
        for (const k of this._params.symbols) {
            const tk = await this.updateSingleTicker(k)
            await this.saveToMongoDB(this.getTickerPath(k), tk)
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