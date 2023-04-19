import { ConfigLoaderBase } from 'lite-ts-config';
import { RpcBase, RpcCallOption } from 'lite-ts-rpc';

export class LoadBalance {
    [app: string]: string;
}

export class BentServerRpc extends RpcBase {
    private m_LoadBalanceRpc: Promise<{ [app: string]: RpcBase; }>;

    public constructor(
        private m_BuildRpcFunc: (url: string) => RpcBase,
        private m_ConfigLoader: ConfigLoaderBase
    ) {
        super();
    }

    protected async onCall<T>(req: RpcCallOption) {
        const routeArgs = req.route.split('/');
        const app = routeArgs[1];

        req.areaNo ??= 0;
        this.m_LoadBalanceRpc ??= new Promise<{ [app: string]: RpcBase; }>(async (s, f) => {
            try {
                const cfg = await this.m_ConfigLoader.load(LoadBalance);
                s(
                    Object.entries(cfg).reduce((memo, [app, url]) => {
                        memo[app] = this.m_BuildRpcFunc(url);
                        return memo;
                    }, {})
                );
            } catch (ex) {
                f(ex);
            }
        });

        const loadBalanceRpc = await this.m_LoadBalanceRpc;

        if (!loadBalanceRpc[app])
            throw new Error(`缺少${LoadBalance.name}.${app}配置`);

        return await loadBalanceRpc[app].call<T>({
            areaNo: req.areaNo,
            route: `/ih/${routeArgs.pop()}`,
            body: req.body,
            header: req.header,
        });
    }
}