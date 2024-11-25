import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage"
import { HelpPage } from "../../pageObjects/Support/HelpPage";
import {test} from "../../test-options"
test.describe('NagaCapital. Support links', async()=>{

    test.beforeEach("Login to platform", async({page, NagaCapital})=>{
        let signIn = new SignIn(page);
        await signIn.goto(NagaCapital, 'login');
        await signIn.signInUserToPlatform("testSupport@i.ua", process.env.USER_PASSWORD || '')
        await new MainPage(page).openBackMenuPoint('F.A.Q');
    })

    test("@23983 Call us links", {tag:'@support'}, async({page})=>{
        let helpPage = new HelpPage(page)
        await helpPage.openCallUsPage();
        expect(await helpPage.getPhoneValue()).toEqual("+248 4 671 946")
        expect(await helpPage.getEmailValue()).toEqual("support@nagacap.com")
    })

    test("@23982 Chat with us page", {tag:'@support'}, async({page})=>{
        let helpPage = new HelpPage(page)
        await helpPage.openChat();
        expect(await helpPage.checkOpenedChat()).toBeVisible()
    })
})

test.describe('Naga Markets. Support links', async()=>{
    
    test.beforeEach("Login to platform", async({page, NagaMarkets}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 30000);
        let signIn = new SignIn(page);
        await signIn.goto(NagaMarkets, 'login');
        await signIn.signInUserToPlatform("testSupportMarkets@i.ua", process.env.USER_PASSWORD || '')
        await new MainPage(page).openBackMenuPoint('F.A.Q');
    })

    test("@23623 Call us links", {tag:'@support'}, async({page})=>{
        let helpPage = new HelpPage(page)
        await helpPage.openCallUsPage();
        expect(await helpPage.getNMContactInfo('General Support Line')).toEqual('+49 40 74305833')
        expect(await helpPage.getNMContactInfo('Dealing Desk')).toEqual("+357 25 041 412")
        expect(await helpPage.getNMContactInfo('Fax Number')).toEqual("+357 25 211 680")
        expect(await helpPage.getNMContactInfo('Email')).toEqual("support@nagamarkets.com")
    })

    test("@23622 Chat with us page", {tag:'@support'},async({page})=>{
        let helpPage = new HelpPage(page)
        await helpPage.openChat();
        expect(await helpPage.checkOpenedChat()).toBeVisible()
    })
})