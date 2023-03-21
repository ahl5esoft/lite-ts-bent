import { EnumItem } from 'lite-ts-enum';

export class TargetTypeData extends EnumItem {
    /**
     * 服务名称
     */
    public app: string;
    /**
     * 请求地址[环境]
     */
    public http: {
        [env: string]: string;
    };
}