import {test as base, BrowserContext, chromium as baseChromium, TestInfo} from "@playwright/test";
import { TestRailIntegration } from "./testrail_setup";

export type TestOptions = {
    NagaMarkets: string;
    NagaCapital: string;
    baseUrl: string;
    browserContext: BrowserContext;
    testInfo: TestInfo
}

export const test = base.extend<TestOptions>({
    NagaMarkets:['', {option: true}],
    NagaCapital:['', {option: true}],
    baseUrl:['', {option: true}],
    browserContext: async({}, use)=>{
        let browser = await baseChromium.launch();
        let context = await browser.newContext();
        await context.addCookies([{name: 'testCookie', domain: '.test.com', 'path':'/', value: '1000000'}]);
        await use(context);
    },
    page: async ({browserContext}, use)=>{
        let page = await browserContext.newPage()
        await use(page)
        console.log(await test.info().status)
        let Tr = await new TestRailIntegration();
        await Tr.addResultToTest(await Tr.getTestRunId(), await test.info().tags, test.info().status)
        await browserContext.close()}
})