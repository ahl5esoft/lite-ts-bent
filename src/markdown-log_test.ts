import { BentMarkdownLog } from './markdown-log';

describe('src/markdown-log.ts', () => {
    describe('push', () => {
        it('ok', async () => {
            const markdownLog = new BentMarkdownLog('dev-ops:', 'https://oapi.dingtalk.com/robot/send?access_token=2c662f0ba1ac4a04d459cf6498d2e05a004998604c4be12c3498ce1a591b7ddd');
            markdownLog.addLabel(
                '测试',
                `错误输出: :  (node:74246) Warning: Accessing non-existent property 'padLevels' of module exports inside circular dependency (Use
                CocosCreator --trace-warnings ...
                to show where the warning was created) Load profile failed: local://settings.json Load profile failed: local://settings.json Load profile failed: local://settings.json (node:74246) [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues. Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead. (node:74283) [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues. Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead. (Use
                CocosCreator Helper (Renderer) --trace-deprecation ...
                to show where the warning was created)`
            );
            await markdownLog.info();
        });
    });
})