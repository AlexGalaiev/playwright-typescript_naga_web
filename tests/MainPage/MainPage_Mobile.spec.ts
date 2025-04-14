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
            expect(await mainPage.checkBackMenuElementIsVisible('discover')).toBeFalsy()
            expect(await mainPage.checkBackMenuElementIsVisible('mm_academy')).toBeFalsy()
            expect(await mainPage.checkBackMenuElementIsVisible('mm_messenger')).toBeFalsy()
            expect(await mainPage.checkBackMenuElementIsVisible('mm_trading_signals')).toBeFalsy()
            await myAccountsMenu.openUserMenu();
            await myAccountsMenu.userLogOut()
        })
        await test.step(`Login to platform by spanish user - ${spanishUser}`, async()=>{
            await signIn.goto(AppNAGA, "login")
            await signIn.signInUserToPlatform(polishUser, process.env.USER_PASSWORD || "")
        })
        await test.step(`Check visibility of UI elements: Discovery, FAQ, Academy.. These elments must be visible`,async()=>{
            await mainPage.openMobileMenu('Menu')
            expect(await mainPage.checkBackMenuElementIsVisible('discover')).toBeTruthy()
            expect(await mainPage.checkBackMenuElementIsVisible('mm_academy')).toBeTruthy()
            expect(await mainPage.checkBackMenuElementIsVisible('mm_messenger')).toBeTruthy()
            expect(await mainPage.checkBackMenuElementIsVisible('mm_trading_signals')).toBeTruthy()
        })
    })
})