import bent from 'bent';

import { IApiDyanmicResponse } from './i-api-dyanmic-response';
import { IRpcCallOption } from './i-rpc-call-option';
import { RpcBase } from './rpc-base';

export class BentDelegateRpc extends RpcBase {
    public constructor(
        private m_GetRequestFunc: (v: IRpcCallOption) => Promise<{
            api: string;
            baseUrl: string;
        }>,
    ) {
        super();
    }

    public async callWithoutThrow<T>(v: IRpcCallOption) {
        const req = await this.m_GetRequestFunc(v);
        const resp = await bent<bent.Json>(req.baseUrl, 'json', 'POST', 200)(`/ih/${req.api}`, v.body, v.header);
        return resp as IApiDyanmicResponse<T>;
    }
}