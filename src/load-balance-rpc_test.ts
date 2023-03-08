import { deepStrictEqual, notDeepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { LoadBalanceBase } from './load-balance-base';
import { LoadBalanceRpc as Self } from './load-balance-rpc';

describe('load-balance-rpc.ts', () => {
    describe('constructor', async () => {
        it('callWithoutThrow', async () => {
            const mockLoadBalance = new Mock<LoadBalanceBase>();
            mockLoadBalance.expectReturn(
                r => r.getUrl('prop', undefined),
                'https://z-api.dengyou.net/prop'
            );
            const self = new Self(mockLoadBalance.actual);
            const res = await self.callWithoutThrow(
                {
                    route: '/prop/ih/find-all-enums'
                }
            );
            deepStrictEqual(res.err, 0);
            notDeepStrictEqual(res.data, undefined);
        });
    });
});