import { deepStrictEqual, notEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import CircuitBreaker from 'opossum';

import { CircuitBreakerRpc as Self } from './circuit-breaker-rpc';

describe('circuit-breaker-rpc', () => {
    describe('callWithoutThrow', () => {
        it('closed', async () => {
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

            const res = await self.callWithoutThrow({
                route: 'https://z-api.dengyou.net/prop/ih/find-all-enums'
            });
            strictEqual(res.err, 0);
        });
        it('opened', async () => {
            const mockBreaker = new Mock<CircuitBreaker>({
                fire() {
                    throw new Error('out of service');
                }
            });
            const self = new Self();
            Reflect.set(
                self,
                'm_Breaker',
                mockBreaker.actual
            );

            let err1;
            try {
                await self.callWithoutThrow({
                    route: 'https://z-api.dengyou.net/prop/ih/find-all-enums'
                });
            } catch (err) {
                err1 = err;
            }

            notEqual(err1, undefined);
        });
        it.only('half-opened', async () => {
            const mockBreaker = new Mock<CircuitBreaker>({
                fire() {
                    return {
                        err: 0,
                        data: {}
                    };
                }
            });
            mockBreaker.expected.halfOpen;
            const self = new Self();
            Reflect.set(
                self,
                'm_Breaker',
                mockBreaker.actual
            );

            const resp = await self.callWithoutThrow({
                route: 'https://z-api.dengyou.net/prop/ih/find-all-enums'
            });

            deepStrictEqual(resp.err, 0);
        });
    });
});