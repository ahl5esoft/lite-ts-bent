import { ApiResponse, RpcCallOption } from 'lite-ts-rpc';
import CircuitBreaker from 'opossum';

import { CircuitBreakerRpcCallOption } from './circuit-braker-call-option';
import { BentRpc } from './rpc';

export class CircuitBreakerRpc extends BentRpc {
    /**
     *  熔断实例
     */
    private m_Breakers: { [key: string]: CircuitBreaker; } = {};

    /**
     * 熔断选项
     */
    private options: CircuitBreaker.Options = {
        errorThresholdPercentage: 50, // 触发熔断的比例
        timeout: 10_000, // 超时时间
        resetTimeout: 30_000, // 重试时间
    };

    public async callWithoutThrow<T>(req: CircuitBreakerRpcCallOption) {
        const abortController = new AbortController();
        const options = {
            abortController,
            ...this.options,
            ...req.breakerOptions
        };

        if (!this.m_Breakers || !this.m_Breakers[req.app]) {
            this.m_Breakers[req.app] = new CircuitBreaker(
                async (
                    route: string,
                    body: RpcCallOption["body"],
                    header: RpcCallOption["header"],
                ) => {
                    return await super.callWithoutThrow({
                        route: route,
                        body: body,
                        header: header,
                    });
                },
                options
            );
        }


        return await this.m_Breakers[req.app].fire(req.route, req.body, req.header) as ApiResponse<T>;
    }
}