import { strictEqual } from 'assert';
import { ILog, LogFactoryBase } from 'lite-ts-log';
import { Mock } from 'lite-ts-mock';

import { BentRpc as Self } from './rpc';

describe('src/rpc.ts', () => {
    describe('.callWithoutThrow<T>(req: BentRpcCallOption)', () => {
        it('ok', async () => {
            const logFactoryMock = new Mock<LogFactoryBase>();
            const self = new Self('http://127.0.0.1:30000', logFactoryMock.actual);

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

            const res = await self.call({
                route: '/prop/ih/find-all-enums',
            });

            strictEqual(res.err, 599);
            strictEqual(errCount, 1);
        });
    });
});