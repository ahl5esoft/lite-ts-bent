import bent from 'bent';
import { LoadEnumHandleOption, LoadEnumHandlerBase } from 'lite-ts-enum';
import { ApiResponse } from 'lite-ts-rpc';

export class LoadBentEnumHandler extends LoadEnumHandlerBase {
    public constructor(
        private m_EnumName: string,
        private m_Url: string,
    ) {
        super();
    }

    public async handle(opt: LoadEnumHandleOption) {
        if (opt.enum.name == this.m_EnumName) {
            const res = await LoadBentEnumHandler.send(this.m_Url, {
                name: opt.enum.name
            });
            opt.res = res.data;
        } else {
            await this.next?.handle?.(opt);
        }
    }

    public static async send(url: string, body: any) {
        return await bent<bent.Json>('', 'json', 'POST', 200)(`${url}/ih/find-enum-items`, body) as ApiResponse<any>;
    }
}