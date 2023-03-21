import { ApiResponse, RpcBase, RpcCallOption } from 'lite-ts-rpc';
import CircuitBreaker from 'opossum';

export class CircuitBreakerRpc extends RpcBase {
    /**
     *  熔断实例
     */
    private m_Breaker: CircuitBreaker;

    /**
     * 熔断选项
     */
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

    public async callWithoutThrow<T>(req: RpcCallOption) {
        this.m_Breaker ??= new CircuitBreaker(
            async (req: RpcCallOption) => {
                return await this.m_Rpc.callWithoutThrow(req);
            }, this.m_Options);

        return await this.m_Breaker.fire(req) as ApiResponse<T>;
    }
}