import { ILog } from './i-log';
import { BentPushBase } from './push-base';

/**
 * 推送markdown日志
 */
export class BentMarkdownLog implements ILog {
    private m_Labels: [string, any][] = [];

    public constructor(
        private m_Push: BentPushBase,
        private m_LimitSize?: number,
    ) {
        this.m_LimitSize ??= 15 * 1024;
    }

    public addLabel(k: string, v: string) {
        this.m_Labels.push([k, v]);
        return this;
    }

    public async debug() {
        await this.send().catch(console.error);
    }

    public async info() {
        await this.send().catch(console.error);
    }

    public async error(err: Error) {
        this.m_Labels.push(['', err]);
        await this.send().catch(console.error);
    }

    public async warning() {
        await this.send().catch(console.error);
    }

    /**
     * 转换成markdown消息
     * 
     * @param labels 标签
     */
    private convertToPushMessage(labels: [string, any][]) {
        return labels.map(r => {
            if (r[1] instanceof Error)
                return `> ${r[1].message}\n> ${r[1].stack}`;

            return `- ${r[0]}: ${r[1]}`;
        }).join('\n').slice(0, this.m_LimitSize);
    }

    private async send() {
        if (!this.m_Labels.length)
            return;

        await this.m_Push.push(
            this.convertToPushMessage(this.m_Labels)
        );
        this.m_Labels = [];
    }
}