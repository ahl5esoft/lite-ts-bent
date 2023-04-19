import { RpcBase, RpcCallOption, RpcResponse } from 'lite-ts-rpc';
import CircuitBreaker from 'opossum';

export class CircuitBreakerRpc extends RpcBase {
    private m_Breaker: CircuitBreaker;

    private m_Options: CircuitBreaker.Options = {
        errorThresholdPercentage: 50, // 触发熔断的比例
        resetTimeout: 30_000, // 重试时间
        timeout: 10_000, // 超时时间
    };

    public constructor(
        private m_Rpc: RpcBase,
        options?: CircuitBreaker.Options
    ) {
        super();

        Object.assign(this.m_Options, options);
    }

    protected async onCall<T>(req: RpcCallOption) {
        this.m_Breaker ??= new CircuitBreaker(async (req: RpcCallOption) => {
            return await this.m_Rpc.call(req);
        }, this.m_Options);

        return await this.m_Breaker.fire(req) as RpcResponse<T>;
    }
}