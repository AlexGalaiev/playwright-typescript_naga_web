import {test as base, BrowserContext, chromium as baseChromium, webkit as webBrowser, TestInfo} from "@playwright/test";
import { TestRailIntegration } from "./testrail_setup";
import { TestError } from "playwright/types/testReporter";

export type TestOptions = {
    NagaMarkets: string;
    NagaCapital: string;
    baseUrl: string;
    browserContext: BrowserContext;
    testInfo: TestInfo;
    NSCountry: string;
    NMCountry: string;
}

export const test = base.extend<TestOptions>({
    NagaMarkets:['', {option: true}],
    NagaCapital:['', {option: true}],
    NSCountry:['', {option: true}],
    NMCountry:['', {option: true}],
    baseUrl:['', {option: true}],
    browserContext: async({}, use)=>{
        let browser = await webBrowser.launch();
        //let browser = await baseChromium.launch();
        let context = await browser.newContext();
        //await context.addCookies([{name: 'testCookie', domain: '.test.com', 'path':'/', value: '1000000'}]);
        await use(context);
    },
    page: async ({browserContext}, use)=>{
        let page = await browserContext.newPage()
        await use(page)
        let Tr = await new TestRailIntegration();
        await Tr.addResultToTest(await Tr.getTestRunId(), await test.info().tags, await test.info().status)
        await Tr.addCommentToTestCase(await Tr.getTestCaseId(await Tr.getTestRunId(), await test.info().tags), await test.info().status)
        await browserContext.close()}
})