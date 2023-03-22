import { notStrictEqual, strictEqual } from 'assert';
import { LoadEnumHandleOption } from 'lite-ts-enum';

import { LoadBentEnumHandler as Self } from './load-enum-handler';

describe('src/load-enum-handler.ts', () => {
    describe('.handle(opt: LoadEnumHandleOption)', () => {
        it('error', async () => {
            const self = new Self('TargetTypeData', 'http://localhost:30000');
            const opt: LoadEnumHandleOption = {
                enum: {
                    name: 'TargetTypeData'
                } as any,
                res: null
            };
            let error;
            try {
                await self.handle(opt);
            } catch (ex) {
                error = ex;
            }
            notStrictEqual(error, undefined);
        });

        it('ok', async () => {
            const self = new Self('TargetTypeData', 'http://localhost:30000');
            Self.send = async (_: string, __: any) => {
                return {
                    err: 0,
                    data: 1
                };
            };
            const opt: LoadEnumHandleOption = {
                enum: {
                    name: 'TargetTypeData'
                } as any,
                res: null
            };
            await self.handle(opt);
            strictEqual(opt.res, 1);
        });
    });
});