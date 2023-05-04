import { BentDingDingMarkdownPush } from './ding-ding-markdown-push'
import { BentMarkdownLog } from './markdown-log';

describe('src/markdown-log.ts', () => {
    describe('push', () => {
        it('ok', async () => {
            const dingTalkPush = new BentDingDingMarkdownPush('dev-ops:', 'https://oapi.dingtalk.com/robot/send?');
            const markdownLog = new BentMarkdownLog(dingTalkPush);
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