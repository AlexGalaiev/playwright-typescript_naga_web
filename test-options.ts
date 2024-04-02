import {test as base, BrowserContext, chromium as baseChromium} from "@playwright/test";

export type TestOptions = {
    NagaMarkets: string;
    NagaCapital: string;
    baseUrl: string;
    browserContext: BrowserContext
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
        await browserContext.close()}
})