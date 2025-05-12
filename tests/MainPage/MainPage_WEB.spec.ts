import { SignIn } from "../../pageObjects/SignIn/SignInPage"
import {MainPage} from "../../pageObjects/MainPage/MainPage"
import {test} from "../../test-options"
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts"
import { expect } from "@playwright/test"
import { UserProfile } from "../../pageObjects/UserProfile/UserProfile"

test.describe('Main Page elements', async()=>{

    type searchTypes = {
        testRailId: string;
        brand: string;
        loginUser: string;
        searchUser: string;
        flag: string
    }
    const searchParams: searchTypes[] = [
        {testRailId: '@23593', brand: '@Markets', loginUser:'testTrading2Markets', searchUser: 'testTrading2', flag:'ba.png'},
        {testRailId: '@25192', brand: '@Capital', loginUser:'testTrading2', searchUser: 'testTrading2Markets', flag:'de.png'}
    ]
    for(const{testRailId, brand, loginUser, searchUser, flag} of searchParams){
        test(`${testRailId} Search functionality`, {tag: '@UI'},async({page, AppNAGA})=>{
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page)
            let userProfile = new UserProfile(page)
            await test.step(`Login to platform by ${loginUser}, ${brand} brand`, async()=>{
                await signIn.goto(AppNAGA, 'login')
                await signIn.signInUserToPlatform(loginUser, process.env.USER_PASSWORD || '')
            })
            await test.step(`Search ${searchUser} from other platform. Open user. Check flag`, async()=>{
                await mainPage.search(searchUser)
                await mainPage.getFoundResults(searchUser)
                expect(await userProfile.getCountryFlag()).toContain(flag)
            })})
    }

})
test.describe('Naga Capital', async()=>{
    type testpBannerTypes = {
        email: string;
        stepName:string;
        text: string
    }
    const testBannerParams: testpBannerTypes[] = [
        {email: "testUserLead@i.ua", stepName:"NAGA Start", text: 'Provide basic info to open a Real-Money account with a $2,000 deposit limit.'},
        {email: "userHalfRegistered@i.ua", stepName:"NAGA Start", text: 'Provide basic info to open a Real-Money account with a $2,000 deposit limit.'},
        {email: "testUserUpgraded@i.ua", stepName:"NAGA Start", text: 'Provide basic info to open a Real-Money account with a $2,000 deposit limit.'}
    ]
    for(const {email, stepName, text} of testBannerParams){
    test(`@23926 Status on widget step ${email}`,{tag: '@UI'}, async({page, AppNAGA})=>{
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page)
        await test.step(`Login to platform by ${email}`, async()=>{
            await signIn.goto(AppNAGA, 'login')
            await signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || '')
        })
        await test.step('Check statuses of steps', async()=>{
            expect(await mainPage.getTextOfWidgetStep(stepName)).toEqual(text)
        })})}
})

test.describe('Naga Markets', async()=>{
    type testpBannerTypes = {
        email: string;
        textOfStep:string;
        stepName: string
    }
    const testBannerParams: testpBannerTypes[] = [
        {email: "testUserLeadMarkets@i.ua", stepName:'Upgrade to Live', textOfStep: "Provide your financial profile, trading experience, and objectives to open a real-money account."},
        {email: "user949", stepName:"Reassessment", textOfStep: 'Based on your classification, some features are restricted. Your can now take the reassessment.'},
        {email: "user460", stepName:"Verify Identity", textOfStep: 'Submit proof of identity and address to verify your profile and activate trading.'},
    ]
    for(const{email, stepName, textOfStep} of testBannerParams){
        test(`@25190 Naga start login banner ${stepName}`,{tag: '@UI'}, async({page, AppNAGA})=>{
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page);
            await test.step(`Login to platform by user ${email}`, async()=>{
                await signIn.goto(AppNAGA, 'login')
                await signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || '')
            })
            await test.step('Check banners with different scorrings', async()=>{
                expect(await mainPage.getTextOfWidgetStep(stepName)).toEqual(textOfStep)
            })
    })}

    test('Spanish user. UI limitation for user', {tag: ['@UI', '@web']}, async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 20000);  
        let spanishUser = 'spanishLeadUser@naga.com'
        let polishUser = 'polishUser@naga.com'
        let signIn = new SignIn(page)
        let mainPage = new MainPage(page)
        await test.step(`Login to platform by spanish user - ${spanishUser}`, async()=>{
            await signIn.goto(AppNAGA, 'login')
            await signIn.signInUserToPlatform(spanishUser, process.env.USER_PASSWORD || '')
        })
        await test.step('Check visibility of UI elements: Discovery, FAQ, Academy.. These elments must be hidden', async()=>{
            await mainPage.mainPageIsDownLoaded()
            expect(await mainPage.checkBackMenuElementIsVisible('mm_discovery')).toBeFalsy()
            expect(await mainPage.checkBackMenuMainCategoryIsVisible('Academy')).toBeFalsy()
            expect(await mainPage.checkMessangerIsVisible()).toBeFalsy()
            await new MyAccounts(page).openUserMenu()
            await new MyAccounts(page).userLogOut()
        })
        await test.step(`Log out and login by ${polishUser}`, async()=>{
            await signIn.goto(AppNAGA, 'login')
            await signIn.signInUserToPlatform(polishUser, process.env.USER_PASSWORD || '')
        })
        await test.step('Check visibility of UI elements: Discovery, FAQ, Academy.. These elments must be visible', async()=>{
            await mainPage.mainPageIsDownLoaded()
            expect(await mainPage.checkBackMenuElementIsVisible('mm_discovery')).toBeTruthy()
            expect(await mainPage.checkBackMenuMainCategoryIsVisible('Academy')).toBeTruthy()
            expect(await mainPage.checkMessangerIsVisible()).toBeTruthy()
        })
    })
})

test.describe('WEB+Mobile',async()=>{

    type balance = {
        brand: string,
        user: string,
    }

    const balanceTestParams: balance[] = [
        {brand:'@Capital', user:'testTrading2'},
        {brand:'@Markets', user:'testTrading2Markets'},
        {brand:'@Mena', user:'testTrading@naga.com'},
        {brand:'@Africa', user:'testTradingAfrica2@naga.com'},
    ]

    for(const{brand, user} of balanceTestParams){
        test(`${brand} Balance view on main page`, {tag: ['@web', '@UI', '@prodSanity']}, async({page, AppNAGA})=>{
            let signIn = new SignIn(page)
            let mainPage = new MainPage(page)
            await test.step(`Login to platform by ${user}, ${brand} brand`, async()=>{
                await signIn.goto(AppNAGA, 'login')
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            })
            await test.step('Check visibility of Balance', async()=>{
                let balance = await mainPage.getBalanceValue('Balance')
                expect(Number(balance)).toBeGreaterThanOrEqual(0)
                expect(balance).not.toBeNaN()
                expect(balance).not.toBeUndefined()
            })
            await test.step('Check visibility of Equity', async()=>{
                let balance = await mainPage.getBalanceValue('Equity')
                expect(Number(balance)).toBeGreaterThanOrEqual(0)
                expect(balance).not.toBeNaN()
                expect(balance).not.toBeUndefined()
            })
            await test.step('Check visibility of Available', async()=>{
                let balance = await mainPage.getBalanceValue('Available')
                expect(Number(balance)).toBeGreaterThanOrEqual(0)
                expect(balance).not.toBeNaN()
                expect(balance).not.toBeUndefined()
            })})
    }

    for(const{brand, user} of balanceTestParams){
        test(`${brand} Mobile. Balance view on main page`, {tag: ['@mobile', '@UI', '@prodSanity']}, async({page, AppNAGA})=>{
            let signIn = new SignIn(page)
            let mainPage = new MainPage(page)
            await test.step(`Login to platform by ${user}, ${brand} brand`, async()=>{
                await signIn.goto(AppNAGA, 'login')
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
                await mainPage.openMobileBalanceMenu()
            })
            await test.step('Check visibility of Balance', async()=>{
                let balance = await mainPage.getBalanceValue('Balance')
                expect(Number(balance)).toBeGreaterThanOrEqual(0)
                expect(balance).not.toBeNaN()
                expect(balance).not.toBeUndefined()
            })
            await test.step('Check visibility of Equity', async()=>{
                let balance = await mainPage.getBalanceValue('Equity')
                expect(Number(balance)).toBeGreaterThanOrEqual(0)
                expect(balance).not.toBeNaN()
                expect(balance).not.toBeUndefined()
            })
            await test.step('Check visibility of Available', async()=>{
                let balance = await mainPage.getBalanceValue('Available')
                expect(Number(balance)).toBeGreaterThanOrEqual(0)
                expect(balance).not.toBeNaN()
                expect(balance).not.toBeUndefined()
            })})
    }
})

