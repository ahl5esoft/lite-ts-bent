import bent from 'bent';
import { ApiResponse, RpcBase, RpcCallOption } from 'lite-ts-rpc';

export class BentRpc extends RpcBase {
    public async callWithoutThrow<T>(req: RpcCallOption) {
        return await bent<bent.Json>(req.route, 'json', 'POST', 200)('', req.body, req.header) as ApiResponse<T>;
    }

}