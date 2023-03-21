import { notStrictEqual, strictEqual } from 'assert';
import { EnumFactoryBase } from 'lite-ts-enum';
import { Mock } from 'lite-ts-mock';

import { ILog, ILogFactory } from './i-log-factory';
import { BentRpc as Self } from './rpc';
import { TargetTypeData } from './target-type-data';

describe('src/rpc.ts', () => {
    describe('.callWithoutThrow<T>(req: BentRpcCallOption)', () => {
        it('ok', async () => {
            const enumFactoryMock = new Mock<EnumFactoryBase>();
            const logFactoryMock = new Mock<ILogFactory>();
            const self = new Self(enumFactoryMock.actual, logFactoryMock.actual);

            let errCount = 0;
            const log = new Mock<ILog>({
                error() {
                    errCount++;
                }
            });
            logFactoryMock.expectReturn(
                r => r.build(),
                log.actual
            );

            enumFactoryMock.expectReturn(
                r => r.build(TargetTypeData),
                {
                    async get() {
                        return {
                            value: 1,
                            app: 'prop',
                            http: {
                                '': 'http://127.0.0.1:30000'
                            }
                        };
                    }
                }
            );

            const res = await self.callWithoutThrow({
                route: '/prop/ih/find-all-enums',
            });

            strictEqual(res.err, 599);
            strictEqual(errCount, 1);
        });

        it('http 不存在', async () => {
            const enumFactoryMock = new Mock<EnumFactoryBase>();
            const self = new Self(enumFactoryMock.actual);

            enumFactoryMock.expectReturn(
                r => r.build(TargetTypeData),
                {
                    async get() {
                        return {
                            value: 1,
                            app: 'prop'
                        };
                    }
                }
            );

            let error;
            try {
                await self.callWithoutThrow({
                    route: '/prop/ih/find-all-enums',
                });
            } catch (ex) {
                error = ex;
            }

            notStrictEqual(error, undefined);
        });
    });
});