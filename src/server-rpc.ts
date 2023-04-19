import { RpcBase, RpcCallOption } from 'lite-ts-rpc';

export class BentServerRpc extends RpcBase {
    private m_LoadBalanceRpc: Promise<{ [app: string]: RpcBase; }>;

    public constructor(
        private m_GetLoadBalanceRpcFunc: () => Promise<{ [app: string]: RpcBase; }>,
    ) {
        super();
    }

    protected async onCall<T>(req: RpcCallOption) {
        const routeArgs = req.route.split('/');
        const app = routeArgs[1];

        req.areaNo ??= 0;
        this.m_LoadBalanceRpc ??= this.m_GetLoadBalanceRpcFunc();
        const loadBalanceRpc = await this.m_LoadBalanceRpc;
        if (!loadBalanceRpc[app])
            throw new Error(`${BentServerRpc.name}: 缺少配置[${app}]`);

        return await loadBalanceRpc[app].call<T>({
            areaNo: req.areaNo,
            route: `/ih/${routeArgs.pop()}`,
            body: req.body,
            header: req.header,
        });
    }
}