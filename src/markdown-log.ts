import bent from 'bent';
import { ILog } from 'lite-ts-log';

interface IResponse {
    /**
     * 错误码
     */
    errcode: number;
    /**
     * 错误消息
     */
    errmsg: string;
}

/**
 * 推送markdown日志
 */
export class BentMarkdownLog implements ILog {
    private m_Labels: [string, any][] = [];
    /**
    * post请求请求函数
    */
    private m_PostFunc: bent.RequestFunction<bent.Json>;

    public constructor(
        private m_Keyword: string,
        url: string,
        private m_LimitSize?: number,
    ) {
        this.m_LimitSize ??= 15 * 1024;
        this.m_PostFunc = bent(url, 'json', 'POST', 200);
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

    /**
     * 推送,推送失败的情况下抛错
     * 
     * @param text 推送文本
     * 
     * @example
     * ```typescript
     *  await new service.BentDingDingMarkdownPush('关键字', 'webhook地址').push(markdown内容);
     * ```
     */
    private async push(content: any) {
        const resp = await this.m_PostFunc('', {
            msgtype: 'markdown',
            markdown: {
                text: content,
                title: this.m_Keyword
            }
        }) as IResponse;
        if (resp.errcode)
            throw new Error(resp.errmsg);
    };

    private async send() {
        if (!this.m_Labels.length)
            return;

        await this.push(
            this.convertToPushMessage(this.m_Labels)
        );
        this.m_Labels = [];
    }
}