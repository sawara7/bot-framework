import { BotFrameClass } from "./bot";
export declare class BotManagerClass {
    private _bots;
    addBot(bot: BotFrameClass): void;
    start(): Promise<void>;
}
