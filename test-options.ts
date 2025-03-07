import {test as base, BrowserContext, chromium as baseChromium, webkit as webBrowser, TestInfo, Page} from "@playwright/test";
import { TestRailIntegration } from "./testrail_setup";
import { TestError } from "playwright/types/testReporter";
import { VPN } from "./pageObjects/Website/VPN";

export type TestOptions = {
    AppNAGA: string;
    baseUrl: string;
    browserContext: BrowserContext;
    testInfo: TestInfo;
    NSCountry: string;
    NMCountry: string;
    NagaMenaCountry: string;
    NagaAfricaCountry: string;
    NagaXCountry: string;
    WebsiteNagaCom: string;
    browserProxyContext: BrowserContext;
    browserProxyContextUAE: BrowserContext;
    browserProxyContextSA: BrowserContext;
    browserProxyContextUA: BrowserContext;
    proxyPage: any;
    proxyPageUAE: any;
    proxyPageSA: any;
    proxyPageUA: any;
}

export const test = base.extend<TestOptions>({
    NagaMarkets:['', {option: true}],
    AppNAGA:['', {option: true}],
    NSCountry:['', {option: true}],
    NMCountry:['', {option: true}],
    NagaMenaCountry:['', {option: true}],
    NagaAfricaCountry:['', {option: true}],
    NagaXCountry:['', {option: true}],
    baseUrl:['', {option: true}],
    WebsiteNagaCom:['', {option: true}],
    browserContext: async({}, use)=>{
        //let browser = await webBrowser.launch();
        let browser = await baseChromium.launch();
        let context = await browser.newContext();
        // await context.addCookies([
        //     //{name: 'bypass-captcha', value: 'd14b41f3874eeb17a7ac2fc21b64a57bafdbe365a6572638ec50411a7945172c', domain:'sxdevcap.com', path:'/'},
        //     {name: 'X-Variant', value:'canary', domain:'', path:'/'}
        // ]);
        await use(context);
    },
    browserProxyContext: async({}, use)=>{
        let browser = await baseChromium.launch();
        let vpn = await new VPN().proxyOptions(process.env.NORDVPN_USERNAME || '', process.env.NORDVPN_PASSWORD || '', 'IT')
        let context = await browser.newContext({proxy:{
            server: vpn,
            username: process.env.NORDVPN_USERNAME || '',
            password: process.env.NORDVPN_PASSWORD || ''
        },
    });
        await use(context)
    },
    browserProxyContextUAE: async({}, use)=>{
        let browser = await baseChromium.launch();
        let vpn = await new VPN().proxyOptions(process.env.NORDVPN_USERNAME || '', process.env.NORDVPN_PASSWORD || '', 'UAE')
        let context = await browser.newContext({proxy:{
            server: vpn,
            username: process.env.NORDVPN_USERNAME || '',
            password: process.env.NORDVPN_PASSWORD || ''
        }});
        await use(context)
    },
    browserProxyContextSA: async({}, use)=>{
        let browser = await baseChromium.launch();
        let vpn = await new VPN().proxyOptions(process.env.NORDVPN_USERNAME || '', process.env.NORDVPN_PASSWORD || '', 'SA')
        let context = await browser.newContext({proxy:{
            server: vpn,
            username: process.env.NORDVPN_USERNAME || '',
            password: process.env.NORDVPN_PASSWORD || ''
        }});
        await use(context)
    },
    browserProxyContextUA: async({}, use)=>{
        let browser = await baseChromium.launch();
        let vpn = await new VPN().proxyOptions(process.env.NORDVPN_USERNAME || '', process.env.NORDVPN_PASSWORD || '', 'UA')
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
        // await Tr.addResultToTest(await Tr.getTestRunId(), await test.info().tags, await test.info().status)
        // await Tr.addCommentToTestCase(await Tr.getTestCaseId(await Tr.getTestRunId(), await test.info().tags), await test.info().status)
        await browserContext.close()
    },
    proxyPage: async({browserProxyContext}, use)=>{
        let page = await browserProxyContext.newPage()
        await use(page)
        let Tr = await new TestRailIntegration();
        // await Tr.addResultToTest(await Tr.getTestRunId(), await test.info().tags, await test.info().status)
        // await Tr.addCommentToTestCase(await Tr.getTestCaseId(await Tr.getTestRunId(), await test.info().tags), await test.info().status)
        await browserProxyContext.close()
    },
    proxyPageUAE: async({browserProxyContextUAE}, use)=>{
        let page = await browserProxyContextUAE.newPage()
        await use(page)
        let Tr = await new TestRailIntegration();
        // await Tr.addResultToTest(await Tr.getTestRunId(), await test.info().tags, await test.info().status)
        // await Tr.addCommentToTestCase(await Tr.getTestCaseId(await Tr.getTestRunId(), await test.info().tags), await test.info().status)
        await browserProxyContextUAE.close()
    },
    proxyPageSA: async({browserProxyContextSA}, use)=>{
        let page = await browserProxyContextSA.newPage()
        await use(page)
        let Tr = await new TestRailIntegration();
        // await Tr.addResultToTest(await Tr.getTestRunId(), await test.info().tags, await test.info().status)
        // await Tr.addCommentToTestCase(await Tr.getTestCaseId(await Tr.getTestRunId(), await test.info().tags), await test.info().status)
        await browserProxyContextSA.close()
    },
    proxyPageUA: async({browserProxyContextUA}, use)=>{
        let page = await browserProxyContextUA.newPage()
        await use(page)
        let Tr = await new TestRailIntegration();
        // await Tr.addResultToTest(await Tr.getTestRunId(), await test.info().tags, await test.info().status)
        // await Tr.addCommentToTestCase(await Tr.getTestCaseId(await Tr.getTestRunId(), await test.info().tags), await test.info().status)
        await browserProxyContextUA.close()
    }
})