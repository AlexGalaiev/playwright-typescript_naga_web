import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SighIn } from "../../pageObjects/SighIn/SignInPage"
import { HelpPage } from "../../pageObjects/Support/HelpPage";
import {test} from "../../test-options"
test.describe('NagaCapital. Support links', async()=>{

    test.beforeEach("Login to platform", async({page, NagaCapital})=>{
        let sighIn = new SighIn(page);
        await sighIn.goto(NagaCapital, 'login');
        await sighIn.sigInUserToPlatform("testSupport@i.ua", process.env.USER_PASSWORD || '')
        await new MainPage(page).openFAQMenuPoint();
    })

    test("@23983 Call us links", {tag:['@smoke','@support']}, async({page})=>{
        let helpPage = new HelpPage(page)
        await helpPage.openCallUsPage();
        expect(await helpPage.getPhoneValue()).toEqual("+248 4 671 946")
        expect(await helpPage.getEmailValue()).toEqual("support@nagacap.com")
    })

    test("@23982 Chat with us page", {tag:['@smoke','@support']}, async({page})=>{
        let helpPage = new HelpPage(page)
        await helpPage.openChat();
        expect(await helpPage.checkOpenedChat()).toBeVisible()
    })
})

test.describe('Naga Markets. Support links', async()=>{
    
    test.beforeEach("Login to platform", async({page, NagaMarkets}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 30000);
        let sighIn = new SighIn(page);
        await sighIn.goto(NagaMarkets, 'login');
        await sighIn.sigInUserToPlatform("testSupportMarkets@i.ua", process.env.USER_PASSWORD || '')
        await new MainPage(page).openFAQMenuPoint();
    })

    test("@23623 Call us links", {tag:['@smoke','@support']}, async({page})=>{
        let helpPage = new HelpPage(page)
        await helpPage.openCallUsPage();
        expect(await helpPage.getNMContactInfo('General Support Line')).toEqual('+49 40 74305833')
        expect(await helpPage.getNMContactInfo('Dealing Desk')).toEqual("+357 25 041 412")
        expect(await helpPage.getNMContactInfo('Fax Number')).toEqual("+357 25 211 680")
        expect(await helpPage.getNMContactInfo('Email')).toEqual("support@nagamarkets.com")
    })

    test("@23622 Chat with us page", {tag:['@smoke','@support']},async({page})=>{
        let helpPage = new HelpPage(page)
        await helpPage.openChat();
        expect(await helpPage.checkOpenedChat()).toBeVisible()
    })



})