import { BotFrameClass } from "./bot";

export class BotManagerClass {
    private _bots: BotFrameClass[] = []
    public OnAfterExecute?: ()=>void

    addBot(bot: BotFrameClass): void {
        this._bots.push(bot)
    }

    async start(): Promise<void> {
        for (const bot of this._bots) {
            await bot.initialize()
        }
        while(true) {
            for (const bot of this._bots) {
                await bot.execute()
            }
            if (this.OnAfterExecute) await this.OnAfterExecute()
        }
    }
}