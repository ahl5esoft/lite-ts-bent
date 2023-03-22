import bent from 'bent';
import { EnumFactoryBase } from 'lite-ts-enum';
import { ApiResponse, RpcBase, RpcCallOption } from 'lite-ts-rpc';

import { ILogFactory } from './i-log-factory';
import { TargetTypeData } from './target-type-data';

export class BentRpc extends RpcBase {
    public constructor(
        private m_EnumFactory: EnumFactoryBase,
        private m_LogFactory?: ILogFactory,
    ) {
        super();
    }

    public async callWithoutThrow<T>(req: RpcCallOption) {
        const routeArgs = req.route.split('/');
        const app = routeArgs[1];

        const targetTypeData = await this.m_EnumFactory.build(TargetTypeData).get(r => r.app == app);
        if (!targetTypeData)
            throw new Error(`缺少TargetTypeData.app[${app}]配置`);

        req.header ??= {};
        const env = req.header['H-E'] ?? '';

        if (!targetTypeData.http?.[env])
            throw new Error(`缺少TargetTypeData.app[${app}] http[${env || '""'}]配置`);

        try {
            req.body ??= {};
            req.body.areaNo ??= req.areaNo;
            return await bent<bent.Json>(targetTypeData.http[env], 'json', 'POST', 200)(`/ih/${routeArgs.pop()}`, req.body, req.header) as ApiResponse<T>;
        } catch (ex) {
            this.m_LogFactory?.build().error(ex);
            return {
                err: 599,
                data: null
            };
        }
    }
}