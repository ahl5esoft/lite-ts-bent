import { strictEqual } from 'assert';

import { BentRpc as Self } from './rpc';

describe('src/rpc.ts', () => {
    describe('.callWithoutThrow<T>(req: BentRpcCallOption)', () => {
        it.only('ok', async () => {
            const res = await new Self().callWithoutThrow({
                route: 'https://z-api.dengyou.net/prop/ih/find-all-enums',
            });
            strictEqual(res.err, 0);
        });

        it('timeout', async () => {
            const res = await new Self().callWithoutThrow({
                route: 'https://www.google.com',
                body: { userID: 'userid1' },
                header: { 'H-A-T': '345345' }
            });
            console.log(res);
        });
    });
});