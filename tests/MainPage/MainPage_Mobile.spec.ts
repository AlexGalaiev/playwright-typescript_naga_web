import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { test } from "../../test-options";
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";


test.describe('NagaMarkets Mobile', async()=>{

    test('Mobile. Spanish user. UI limitation for user', {tag: ['@UI', '@mobile']}, async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 20000);  
        let spanishUser = 'spanishLeadUser@naga.com'
        let polishUser = 'polishUser@naga.com'
        let signIn = new SignIn(page)
        let mainPage = new MainPage(page)
        let myAccountsMenu = new MyAccounts(page)
        await test.step(`Login to platform by spanish user - ${spanishUser}`, async()=>{
            await signIn.goto(AppNAGA, "login")
            await signIn.signInUserToPlatform(spanishUser, process.env.USER_PASSWORD || "")
        })
        await test.step('Check visibility of UI elements: Discovery, FAQ, Academy.. These elments must be hidden', async()=>{
            await mainPage.openMobileMenu('Menu')
            expect(await mainPage.checkBackMenuMobileIsVisible('Discover')).toBeFalsy()
            expect(await mainPage.checkBackMenuMobileIsVisible('Trading Signals')).toBeFalsy()
            expect(await mainPage.checkBackMenuMobileIsVisible('Articles')).toBeFalsy()
            expect(await mainPage.checkBackMenuMobileIsVisible('Videos')).toBeFalsy()
            expect(await mainPage.checkBackMenuMobileIsVisible('Webinars')).toBeFalsy()
            expect(await mainPage.checkBackMenuMobileIsVisible('eBooks')).toBeFalsy()
            expect(await mainPage.checkBackMenuMobileIsVisible('Glossary')).toBeFalsy()
            expect(await mainPage.checkBackMenuMobileIsVisible('Webinars')).toBeFalsy()
            await mainPage.logOutUserMobile();
        })
        await test.step(`Login to platform by spanish user - ${spanishUser}`, async()=>{
            await signIn.goto(AppNAGA, "login")
            await signIn.signInUserToPlatform(polishUser, process.env.USER_PASSWORD || "")
        })
        await test.step(`Check visibility of UI elements: Discovery, FAQ, Academy.. These elments must be visible`,async()=>{
            await mainPage.openMobileMenu('Menu')
            expect(await mainPage.checkBackMenuMobileIsVisible('Discover')).toBeTruthy()
            expect(await mainPage.checkBackMenuMobileIsVisible('Trading Signals')).toBeTruthy()
            expect(await mainPage.checkBackMenuMobileIsVisible('Articles')).toBeTruthy()
            expect(await mainPage.checkBackMenuMobileIsVisible('Videos')).toBeTruthy()
            expect(await mainPage.checkBackMenuMobileIsVisible('Webinars')).toBeTruthy()
            expect(await mainPage.checkBackMenuMobileIsVisible('eBooks')).toBeTruthy()
            expect(await mainPage.checkBackMenuMobileIsVisible('Glossary')).toBeTruthy()
            expect(await mainPage.checkBackMenuMobileIsVisible('Webinars')).toBeTruthy()
        })})
})
