import { deepStrictEqual } from 'assert';
import { ConfigLoaderBase } from 'lite-ts-config';
import { Mock } from 'lite-ts-mock';
import { RpcBase } from 'lite-ts-rpc';

import { BentServerRpc as Self, LoadBalance } from './server-rpc';

describe('src/rpc.ts', () => {
    describe('.onCall<T>(req: BentRpcCallOption)', () => {
        it('ok', async () => {
            const configLoaderMock = new Mock<ConfigLoaderBase>();
            const rpcMock = new Mock<RpcBase>();
            const self = new Self(() => {
                return rpcMock.actual;
            }, configLoaderMock.actual);

            configLoaderMock.expectReturn(
                r => r.load(LoadBalance),
                {
                    prop: 'http://localhost:30000'
                }
            );

            rpcMock.expectReturn(
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