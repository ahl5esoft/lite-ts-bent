import { CircuitBreakerRpc as Self } from './circuit-breaker-rpc';

describe('circuit-breaker-rpc', () => {
    describe('callWithoutThrow', () => {
        it('not any breaker', async () => {
            const self = new Self();
            Reflect.set(
                self,
                'm_Breaker',
                null
            );
            Reflect.set(
                self,
                'options',
                {
                    errorThresholdPercentage: 80, // 触发熔断的比例
                    timeout: 1000, // 超时时间
                    resetTimeout: 600000, // 重试时间 
                }
            );

            console.log('第一次请求：');
            const res1 = await self.callWithoutThrow({
                route: 'https://z-api.dengyou.net/prop/ih/find-all-enums',
                app: 'prop'
            });
            console.log(res1);

            for (let i = 0; i < 20; i++) {
                try {
                    console.log(`第${i}次请求：`);
                    await self.callWithoutThrow({
                        route: 'https://www.google.com',
                        app: 'google'
                    });
                } catch (e) {
                    console.log(e);
                }
            }

            console.log('熔断后请求其他服务：');
            const res2 = await self.callWithoutThrow({
                route: 'https://z-api.dengyou.net/prop/ih/find-all-enums',
                app: 'prop'
            });
            console.log(res2);
        });

    });
});