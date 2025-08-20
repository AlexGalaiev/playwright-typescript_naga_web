import {test as base, BrowserContext, chromium as baseChromium, webkit as webBrowser, TestInfo, Page} from "@playwright/test";
import { TestRailIntegration } from "./testrail_setup";
import { TestError } from "playwright/types/testReporter";
import { createVpnApp, VPN } from "./pageObjects/Website/VPN";
import { BaseTest } from "./pageObjects/baseTest";

export type TestOptions = {
    AppNAGA: string;
    AppNAGAX: string;
    baseUrl: string;
    browserContext: BrowserContext;
    testInfo: TestInfo;
    NSCountry: string;
    NMCountry: string;
    NagaMenaCountry: string;
    NagaAfricaCountry: string;
    NagaXCountry: string;
    WebsiteNagaCom: string;
    page2: Page;
    app: BaseTest;
    appSpain: BaseTest;
    appUAE: BaseTest;
    appUA: BaseTest;
    appIT: BaseTest;
    appSA: BaseTest;
    appBH: BaseTest;
    CapexWebsite: string
    Capex: string
}

export const test = base.extend<TestOptions>({
    AppNAGA:['', {option: true}],
    AppNAGAX:['', {option: true}],
    NSCountry:['', {option: true}],
    NMCountry:['', {option: true}],
    NagaMenaCountry:['', {option: true}],
    NagaAfricaCountry:['', {option: true}],
    NagaXCountry:['', {option: true}],
    baseUrl:['', {option: true}],
    WebsiteNagaCom:['', {option: true}],
    CapexWebsite:['', {option: true}],
    Capex:['', {option: true}],
    browserContext: async({}, use)=>{
        let browser = await baseChromium.launch();
        let context = await browser.newContext();
        await use(context);
    },
    page: async ({browserContext}, use)=>{
        let page = await browserContext.newPage()
        await use(page)
        let Tr = await new TestRailIntegration();
        // await Tr.addResultToTest(await Tr.getTestRunId(), await test.info().tags, await test.info().status)
        // await Tr.addCommentToTestCase(await Tr.getTestCaseId(await Tr.getTestRunId(), await test.info().tags), await test.info().status)
        await browserContext.close()
    },
    page2: async ({browserContext}, use)=>{
        let page = await browserContext.newPage()
        await use(page)
        let Tr = await new TestRailIntegration();
        // await Tr.addResultToTest(await Tr.getTestRunId(), await test.info().tags, await test.info().status)
        // await Tr.addCommentToTestCase(await Tr.getTestCaseId(await Tr.getTestRunId(), await test.info().tags), await test.info().status)
        await browserContext.close()
    },
    app: async({ page }, use) =>{
        const context = new BaseTest(page)
        await use(context)
    },
    appSpain: async({}, use) =>{
        const {app, context, browser} = await createVpnApp('ES')
        await use(app)
        await context.close()
        await browser.close()
    },
    appUAE: async({}, use) =>{
        const {app, context, browser} = await createVpnApp('UAE')
        await use(app)
        await context.close()
        await browser.close()
    },
    appUA: async({}, use) =>{
        const {app, context, browser} = await createVpnApp('UA')
        await use(app)
        await context.close()
        await browser.close()
    },
    appIT: async({}, use) =>{
        const {app, context, browser} = await createVpnApp('IT')
        await use(app)
        await context.close()
        await browser.close()
    },
    appSA: async({}, use) =>{
        const {app, context, browser} = await createVpnApp('SA')
        await use(app)
        await context.close()
        await browser.close()
    },
    appBH: async({}, use) =>{
        const {app, context, browser} = await createVpnApp('BH')
        await use(app)
        await context.close()
        await browser.close()
    },
})