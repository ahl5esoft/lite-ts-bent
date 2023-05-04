export abstract class BentPushBase {
    public abstract push(content: any): Promise<void>;
}