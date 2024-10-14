import {test as base, BrowserContext, chromium as baseChromium, webkit as webBrowser, TestInfo, Page} from "@playwright/test";
import { TestRailIntegration } from "./testrail_setup";
import { TestError } from "playwright/types/testReporter";
import { VPN } from "./pageObjects/Website/VPN";

export type TestOptions = {
    NagaMarkets: string;
    NagaCapital: string;
    NagaAxon: string;
    baseUrl: string;
    browserContext: BrowserContext;
    testInfo: TestInfo;
    NSCountry: string;
    NMCountry: string;
    NACountry: string;
    WebsiteNagaCom: string;
    browserProxyContext: BrowserContext;
    proxyPage: any
}

export const test = base.extend<TestOptions>({
    NagaMarkets:['', {option: true}],
    NagaCapital:['', {option: true}],
    NagaAxon: ['', {option: true}],
    NSCountry:['', {option: true}],
    NMCountry:['', {option: true}],
    NACountry:['', {option: true}],
    baseUrl:['', {option: true}],
    WebsiteNagaCom:['', {option: true}],
    browserContext: async({}, use)=>{
        //let browser = await webBrowser.launch();
        let browser = await baseChromium.launch();
        let context = await browser.newContext();
        //await context.addCookies([{name: 'testCookie', domain: '.test.com', 'path':'/', value: '1000000'}]);
        await use(context);
    },
    browserProxyContext: async({}, use)=>{
        let browser = await baseChromium.launch();
        let vpn = await new VPN().proxyOptions(process.env.NORDVPN_USERNAME || '', process.env.NORDVPN_PASSWORD || '')
        let context = await browser.newContext({proxy:{
            server: vpn,
            username: process.env.NORDVPN_USERNAME || '',
            password: process.env.NORDVPN_PASSWORD || ''
        }});
        await use(context)
    },
    page: async ({browserContext}, use)=>{
        let page = await browserContext.newPage()
        await use(page)
        let Tr = await new TestRailIntegration();
        await Tr.addResultToTest(await Tr.getTestRunId(), await test.info().tags, await test.info().status)
        await Tr.addCommentToTestCase(await Tr.getTestCaseId(await Tr.getTestRunId(), await test.info().tags), await test.info().status)
        await browserContext.close()
    },
    proxyPage: async({browserProxyContext}, use)=>{
        let page = await browserProxyContext.newPage()
        await use(page)
        let Tr = await new TestRailIntegration();
        await Tr.addResultToTest(await Tr.getTestRunId(), await test.info().tags, await test.info().status)
        await Tr.addCommentToTestCase(await Tr.getTestCaseId(await Tr.getTestRunId(), await test.info().tags), await test.info().status)
        await browserProxyContext.close()
    }
})