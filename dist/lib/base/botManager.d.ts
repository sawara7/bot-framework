import { BotFrameClass } from "./bot";
export declare class BotManagerClass {
    private _bots;
    OnAfterExecute?: () => void;
    addBot(bot: BotFrameClass): void;
    start(): Promise<void>;
}
