import { deepStrictEqual } from 'assert';
import { Enum, EnumFactoryBase } from 'lite-ts-enum';
import { Mock } from 'lite-ts-mock';
import { AreaData, RpcBase } from 'lite-ts-rpc';

import { BentServerRpc as Self } from './server-rpc';

describe('src/rpc.ts', () => {
    describe('.onCall<T>(req: BentRpcCallOption)', () => {
        it('ok', async () => {
            const enumFactoryMock = new Mock<EnumFactoryBase>();
            const rpcMock = new Mock<RpcBase>();
            const self = new Self(() => {
                return rpcMock.actual;
            }, enumFactoryMock.actual);

            const enumAreaMock = new Mock<Enum<AreaData>>({
                get allItem() {
                    return {
                        1: {
                            value: 1,
                            loadBalance: {
                                prop: 'http://localhost:30000'
                            }
                        }
                    };
                }
            });
            enumFactoryMock.expectReturn(
                r => r.build(AreaData),
                enumAreaMock.actual
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