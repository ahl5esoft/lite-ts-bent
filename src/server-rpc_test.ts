import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import { RpcBase } from 'lite-ts-rpc';

import { BentServerRpc as Self } from './server-rpc';

describe('src/rpc.ts', () => {
    describe('.onCall<T>(req: BentRpcCallOption)', () => {
        it('ok', async () => {
            const mockRpc = new Mock<RpcBase>();
            const self = new Self(async () => {
                return {
                    prop: mockRpc.actual
                };
            });

            mockRpc.expectReturn(
                r => r.call({
                    areaNo: 1,
                    route: '/ih/find-enum-items',
                    body: undefined,
                    header: undefined
                }),
                {
                    err: 0,
                    data: 1
                }
            );

            const res = await self.call({
                route: '/prop/find-enum-items',
                areaNo: 1
            });
            deepStrictEqual(res, {
                err: 0,
                data: 1
            });
        });
    });
});