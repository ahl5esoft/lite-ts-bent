import { BentDelegateRpc } from './delegate-rpc';
import { LoadBalanceBase } from './load-balance-base';
import { HeaderEnum } from './header-enum';

export class LoadBalanceRpc extends BentDelegateRpc {
    public constructor(
        loadBalance: LoadBalanceBase,
    ) {
        super(async v => {
            const routeArgs = v.route.split('/');
            return {
                api: routeArgs.pop(),
                baseUrl: await loadBalance.getUrl(routeArgs[1], v.header?.[HeaderEnum.env])
            };
        });
    }
}