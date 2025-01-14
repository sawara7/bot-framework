import {
    TickerCollectorCustomeClassParams,
} from "./types"
import {
    BotFrameClass
} from "../base/bot"
import { Ticker } from "utils-trade"
import { getTickerPath } from "../base"

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
            await this.saveToMongoDBInsert(getTickerPath(k), Object.assign({}, tk))
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