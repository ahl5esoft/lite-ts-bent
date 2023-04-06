import bent from 'bent';
import { ApiResponse, RpcBase, RpcCallOption } from 'lite-ts-rpc';

import { ILogFactory } from './i-log-factory';

export class BentRpc extends RpcBase {
    public constructor(
        private m_Url: string,
        private m_LogFactory: ILogFactory,
    ) {
        super();
    }

    protected async onCall<T>(v: RpcCallOption) {
        const routeArgs = v.route.split('/');

        v.body ??= {};
        v.body.areaNo ??= v.areaNo;

        try {
            return await bent<bent.Json>(this.m_Url, 'json', 'POST', 200)(`/ih/${routeArgs.pop()}`, v.body, v.header) as ApiResponse<T>;
        } catch (ex) {
            this.m_LogFactory.build().error(ex);
            return {
                err: 599,
                data: null
            };
        }
    }
}