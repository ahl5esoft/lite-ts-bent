import { EnumFactoryBase } from 'lite-ts-enum';
import { AreaData, RpcBase, RpcCallOption } from 'lite-ts-rpc';

export class BentServerRpc extends RpcBase {
    private m_LoadBalanceRpc: {
        [areaNo: number]: {
            [app: string]: RpcBase;
        };
    } = {};

    public constructor(
        private m_BuildRpcFunc: (url: string) => RpcBase,
        private m_EnumFactory: EnumFactoryBase,
    ) {
        super();
    }

    public async callWithoutThrow<T>(req: RpcCallOption) {
        const routeArgs = req.route.split('/');
        const app = routeArgs[1];

        req.areaNo ??= 0;
        const allItems = await this.m_EnumFactory.build(AreaData).allItem;
        const areaData = allItems?.[req.areaNo];
        if (!areaData)
            throw new Error(`缺少${AreaData.name}.value = ${req.areaNo} 配置`);

        if (!this.m_LoadBalanceRpc[req.areaNo]) {
            this.m_LoadBalanceRpc[req.areaNo] = Object.entries(areaData.loadBalance).reduce((memo, [k, v]) => {
                memo[k] = this.m_BuildRpcFunc(v);
                return memo;
            }, {});
        }

        if (!this.m_LoadBalanceRpc[req.areaNo][app])
            throw new Error(`缺少${AreaData.name}[${req.areaNo}].loadBalance[${app}]配置`);

        return await this.m_LoadBalanceRpc[req.areaNo][app].callWithoutThrow<T>({
            areaNo: req.areaNo,
            route: `/ih/${routeArgs.pop()}`,
            body: req.body,
            header: req.header,
        });
    }
}