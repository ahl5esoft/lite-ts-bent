import { notEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import { RpcBase } from 'lite-ts-rpc';

import { CircuitBreakerRpc as Self } from './circuit-breaker-rpc';

describe('circuit-breaker-rpc', () => {
    describe('callWithoutThrow', () => {
        it('closed', async () => {
            const mockRpc = new Mock<RpcBase>({
                call() {
                    return {
                        err: 0,
                        data: {}
                    };
                }
            });
            const self = new Self(mockRpc.actual);
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

            const res = await self.call({
                route: 'https://z-api.dengyou.net/prop/ih/find-all-enums'
            });
            strictEqual(res.err, 0);
        });

        it('opened', async () => {
            const mockRpc = new Mock<RpcBase>({
                callWithoutThrow() {
                    throw new Error('out of service');
                }
            });
            const self = new Self(mockRpc.actual);

            let err1;
            try {
                await self.call({
                    route: 'https://z-api.dengyou.net/prop/ih/find-all-enums'
                });
            } catch (err) {
                err1 = err;
            }

            notEqual(err1, undefined);
        });

        it('half-opened', async () => {
            const mockRpc = new Mock<RpcBase>({
                call() {
                    return {
                        err: 0,
                        data: {}
                    };
                }
            });
            const self = new Self(mockRpc.actual);
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

            const res = await self.call({
                route: 'https://z-api.dengyou.net/prop/ih/find-all-enums'
            });
            strictEqual(res.err, 0);
        });
    });
});