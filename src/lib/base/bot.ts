import { RealtimeDatabaseClass, getRealTimeDatabase } from "utils-firebase-server"
import { MongodbManagerClass } from "utils-mongodb"
import { BaseBotParams, BaseBotResult, BaseBotStatus, TickerType, getBaseBotStatus, getDefaultTicker } from "./types"
import { sleep } from "utils-general"

export abstract class BotFrameClass {
    private _realtimeDB: RealtimeDatabaseClass | undefined
    private _mongoDB: MongodbManagerClass | undefined
    private _cumulativeProfit: number = 0
    private _botStatus: BaseBotStatus = getBaseBotStatus()
    private _initialBadget = 0
    private _currentBadget = 0
    private _previousTicker: TickerType = getDefaultTicker()
    private _currentTicker: TickerType = getDefaultTicker()

    constructor(private _baseParams: BaseBotParams) {
        // 
    }

    async start(): Promise<void> {
        await this.initialize()
        while(this.isBackTest || await this.getBotStatusFromRealtimeDbAndIsContinue()) {
            try {
                if (!this.isBackTest && await this.isStopOrClearPosition()) continue
                await this.updateBadget()
                await this.updateTicker()
                this._previousTicker = this._currentTicker
                await this.updateTrade()
                if (!this.isBackTest) await this.setBotResultToRealtimeDB()
            } catch(e) {
                const err = e as Error
                console.log(this._baseParams.botName, err.name, err.message)
            } finally {
                if (!this.isBackTest) console.log(this._baseParams.botName, new Date().toLocaleString())
            }
        }
    }

    protected async initialize(): Promise<void> {
        if (!this.isBackTest && this._baseParams.useRealtimeDB) {
            this._realtimeDB = await getRealTimeDatabase()
            await this.setBotStatusToRealtimeDB()
        }
        if (!this.isBackTest && this._baseParams.useMongoDBAndDBName) {
            this._mongoDB = new MongodbManagerClass(this._baseParams.useMongoDBAndDBName)
            await this._mongoDB.connect()
        }
        await this.updateBadget()
        this._initialBadget = this._currentBadget
        if (isNaN(this._initialBadget) || this._initialBadget === 0) {
            throw new Error('Update initial badget error.')
        }
    }

    private async isStopOrClearPosition(): Promise<boolean> {
        if (this._botStatus.isStop) {
            await sleep(1000)
            return true
        }
        if (this._botStatus.isClear) {
            await this.clearPosition()
            this._botStatus.isClear = false
            await sleep(1000)
            return true    
        }
        return false
    }

    private async getBotStatusFromRealtimeDbAndIsContinue(): Promise<boolean> {
        if (!this._realtimeDB) throw new Error("no realtime db.")
        this._botStatus = await this._realtimeDB.get(await this._realtimeDB.getReference("botStatus/" + this._baseParams.botName)) as BaseBotStatus
        return !this._botStatus.isExit
    }

    abstract clearPosition(): Promise<void>

    abstract updateTicker(): Promise<void>

    abstract updateBadget(): Promise<void> 

    abstract updateTrade(): Promise<void>

    private async setBotStatusToRealtimeDB(): Promise<void> {
        if (!this._realtimeDB) throw new Error("no realtime db.")
        await this._realtimeDB.set("botStatus/" + this._baseParams.botName, this._botStatus)
    }
    
    private async setBotResultToRealtimeDB(): Promise<void> {
        if (this._realtimeDB) await this._realtimeDB.set('botResult/' + this._baseParams.botName, await this.getBotResult())
    }

    protected get isBackTest(): boolean {
        return this._baseParams.isBackTest? true: false
    }

    protected async getBotResult(): Promise<BaseBotResult> {
        return {
            botName: this._baseParams.botName,
            logicName: this._baseParams.logicName,
            updateTimestamp: new Date().toLocaleString(),
            cumulativeProfit: this.cumulativeProfit.toString(),
            currentBadget: this.currentBadget.toString(),
            initialBadget: this.initialBadget.toString(),
            ticker: this.currentTicker
        }
    }

    protected get cumulativeProfit(): number {
        return this._cumulativeProfit
    }

    protected set cumulativeProfit(value: number) {
        this._cumulativeProfit = value
    }

    protected get currentBadget(): number {
        return this._currentBadget
    }

    protected set currentBadget(badget: number) {
        this._currentBadget = badget
    }

    protected get initialBadget(): number {
        return this._initialBadget
    }

    protected get currentTicker(): TickerType {
        return this._currentTicker
    }

    protected set currentTicker(tk: TickerType) {
        this._currentTicker = tk
    }

    protected get previousTicker(): TickerType {
        return this._previousTicker
    }
}