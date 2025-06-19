import { expect } from "@playwright/test";
import { test } from "../../test-options";

test.describe('NagaMarkets Mobile', async()=>{

    test('Mobile. Spanish user. UI limitation for user', {tag: ['@UI', '@mobile']}, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 20000);  
        let spanishUser = 'spanishLeadUser@naga.com'
        let polishUser = 'polishUser@naga.com'
        await test.step(`Login to platform by spanish user - ${spanishUser}`, async()=>{
            await app.signIn.goto(AppNAGA, "login")
            await app.signIn.signInUserToPlatform(spanishUser, process.env.USER_PASSWORD || "")
        })
        await test.step('Check visibility of UI elements: Discovery, FAQ, Academy.. These elments must be hidden', async()=>{
            await app.mainPage.openMobileMenu('Menu')
            expect(await app.mainPage.checkBackMenuMobileIsVisible('Discover')).toBeFalsy()
            expect(await app.mainPage.checkBackMenuMobileIsVisible('Trading Signals')).toBeFalsy()
            expect(await app.mainPage.checkBackMenuMobileIsVisible('Articles')).toBeFalsy()
            expect(await app.mainPage.checkBackMenuMobileIsVisible('Videos')).toBeFalsy()
            expect(await app.mainPage.checkBackMenuMobileIsVisible('Webinars')).toBeFalsy()
            expect(await app.mainPage.checkBackMenuMobileIsVisible('eBooks')).toBeFalsy()
            expect(await app.mainPage.checkBackMenuMobileIsVisible('Glossary')).toBeFalsy()
            expect(await app.mainPage.checkBackMenuMobileIsVisible('Webinars')).toBeFalsy()
            await app.mainPage.logOutUserMobile();
        })
        await test.step(`Login to platform by spanish user - ${spanishUser}`, async()=>{
            await app.signIn.goto(AppNAGA, "login")
            await app.signIn.signInUserToPlatform(polishUser, process.env.USER_PASSWORD || "")
        })
        await test.step(`Check visibility of UI elements: Discovery, FAQ, Academy.. These elments must be visible`,async()=>{
            await app.mainPage.openMobileMenu('Menu')
            expect(await app.mainPage.checkBackMenuMobileIsVisible('Discover')).toBeTruthy()
            expect(await app.mainPage.checkBackMenuMobileIsVisible('Trading Signals')).toBeTruthy()
            expect(await app.mainPage.checkBackMenuMobileIsVisible('Articles')).toBeTruthy()
            expect(await app.mainPage.checkBackMenuMobileIsVisible('Videos')).toBeTruthy()
            expect(await app.mainPage.checkBackMenuMobileIsVisible('Webinars')).toBeTruthy()
            expect(await app.mainPage.checkBackMenuMobileIsVisible('eBooks')).toBeTruthy()
            expect(await app.mainPage.checkBackMenuMobileIsVisible('Glossary')).toBeTruthy()
            expect(await app.mainPage.checkBackMenuMobileIsVisible('Webinars')).toBeTruthy()
        })})
})
