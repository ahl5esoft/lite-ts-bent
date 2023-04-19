import bent from 'bent';
import { LogFactoryBase } from 'lite-ts-log';
import { RpcResponse, RpcBase, RpcCallOption } from 'lite-ts-rpc';

export class BentRpc extends RpcBase {
    public constructor(
        private m_Url: string,
        private m_LogFactory: LogFactoryBase,
    ) {
        super();
    }

    protected async onCall<T>(v: RpcCallOption) {
        try {
            v.body ??= {};
            v.body.areaNo ??= v.areaNo;

            const routeArgs = v.route.split('/');
            return await bent<bent.Json>(this.m_Url, 'json', 'POST', 200)(`/ih/${routeArgs.pop()}`, v.body, v.header) as RpcResponse<T>;
        } catch (ex) {
            this.m_LogFactory.build().error(ex);
            return {
                err: 599,
                data: null
            };
        }
    }
}