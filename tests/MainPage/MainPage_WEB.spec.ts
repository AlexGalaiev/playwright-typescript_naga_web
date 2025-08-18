import {test} from "../../test-options"
import { expect } from "@playwright/test"

test.describe('Main Page elements', async()=>{

    type searchTypes = {
        brand: string;
        loginUser: string;
        searchUser: string;
        flag: string
    }
    const searchParams: searchTypes[] = [
        {brand: '@Markets', loginUser:'testTrading2Markets', searchUser: 'testTrading2', flag:'ba.png'},
        {brand: '@Capital', loginUser:'testTrading2', searchUser: 'testTrading2Markets', flag:'de.png'}
    ]
    for(const{brand, loginUser, searchUser, flag} of searchParams){
        test(`${brand} Search functionality`, {tag: '@UI'}, async({app, AppNAGA})=>{
            await test.step(`Login to platform by ${loginUser}, ${brand} brand`, async()=>{
                await app.signIn.goto(AppNAGA, 'login')
                await app.signIn.signInUserToPlatform(loginUser, process.env.USER_PASSWORD || '')
            })
            await test.step(`Search ${searchUser} from other platform. Open user. Check flag`, async()=>{
                await app.mainPage.search(searchUser)
                await app.mainPage.getFoundResults(searchUser)
                expect(await app.userProfile.getCountryFlag()).toContain(flag)
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
    test(`Status on widget step ${email}`,{tag: '@UI'}, async({app, AppNAGA})=>{
        await test.step(`Login to platform by ${email}`, async()=>{
            await app.signIn.goto(AppNAGA, 'login')
            await app.signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || '')
        })
        await test.step('Check statuses of steps', async()=>{
            expect(await app.mainPage.getTextOfWidgetStep(stepName)).toEqual(text)
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
        test(`Naga start login banner ${stepName}`,{tag: '@UI'}, async({app, AppNAGA})=>{
            await test.step(`Login to platform by user ${email}`, async()=>{
                await app.signIn.goto(AppNAGA, 'login')
                await app.signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || '')
            })
            await test.step('Check banners with different scorrings', async()=>{
                expect(await app.mainPage.getTextOfWidgetStep(stepName)).toEqual(textOfStep)
            })
    })}

    test('Spanish user. UI limitation for user', {tag: ['@UI', '@web','@smoke']}, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 20000);  
        let spanishUser = 'spanishLeadUser@naga.com'
        let polishUser = 'polishUser@naga.com'
        await test.step(`Login to platform by spanish user - ${spanishUser}`, async()=>{
            await app.signIn.goto(AppNAGA, 'login')
            await app.signIn.signInUserToPlatform(spanishUser, process.env.USER_PASSWORD || '')
        })
        await test.step('Check visibility of UI elements: Discovery, FAQ, Academy.. These elments must be hidden', async()=>{
            await app.mainPage.mainPageIsDownLoaded()
            expect(await app.mainPage.checkBackMenuElementIsVisible('mm_discovery')).toBeFalsy()
            expect(await app.mainPage.checkBackMenuMainCategoryIsVisible('Academy')).toBeFalsy()
            expect(await app.mainPage.checkMessangerIsVisible()).toBeFalsy()
            await app.myAccounts.openUserMenu()
            await app.myAccounts.userLogOut()
        })
        await test.step(`Log out and login by ${polishUser}`, async()=>{
            await app.signIn.goto(AppNAGA, 'login')
            await app.signIn.signInUserToPlatform(polishUser, process.env.USER_PASSWORD || '')
        })
        await test.step('Check visibility of UI elements: Discovery, FAQ, Academy.. These elments must be visible', async()=>{
            await app.mainPage.mainPageIsDownLoaded()
            expect(await app.mainPage.checkBackMenuElementIsVisible('mm_discovery')).toBeTruthy()
            expect(await app.mainPage.checkBackMenuMainCategoryIsVisible('Academy')).toBeTruthy()
            expect(await app.mainPage.checkMessangerIsVisible()).toBeTruthy()
        })})
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
        test.fixme(`${brand} Balance view on main page`, {tag: ['@web', '@UI', '@prodSanity', '@smoke']}, async({app, AppNAGA})=>{
            await test.step(`Login to platform by ${user}, ${brand} brand`, async()=>{
                await app.signIn.goto(AppNAGA, 'login')
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            })
            await test.step('Check visibility of Balance', async()=>{
                let balance = await app.mainPage.getBalanceValue('Balance')
                expect(Number(balance)).toBeGreaterThanOrEqual(0)
                expect(balance).not.toBeNaN()
                expect(balance).not.toBeUndefined()
            })
            await test.step('Check visibility of Equity', async()=>{
                let balance = await app.mainPage.getBalanceValue('Equity')
                expect(Number(balance)).toBeGreaterThanOrEqual(0)
                expect(balance).not.toBeNaN()
                expect(balance).not.toBeUndefined()
            })
            await test.step('Check visibility of Available', async()=>{
                let balance = await app.mainPage.getBalanceValue('Available')
                expect(Number(balance)).toBeGreaterThanOrEqual(0)
                expect(balance).not.toBeNaN()
                expect(balance).not.toBeUndefined()
            })})
    }

    for(const{brand, user} of balanceTestParams){
        test(`${brand} Mobile. Balance view on main page`, 
            {tag: ['@mobile', '@UI', '@prodSanity']}, async({app, AppNAGA})=>{
            await test.step(`Login to platform by ${user}, ${brand} brand`, async()=>{
                await app.signIn.goto(AppNAGA, 'login')
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
                await app.mainPage.openMobileBalanceMenu()
            })
            await test.step('Check visibility of Balance', async()=>{
                let balance = await app.mainPage.getBalanceValue('Balance')
                expect(Number(balance)).toBeGreaterThanOrEqual(0)
                expect(balance).not.toBeNaN()
                expect(balance).not.toBeUndefined()
            })
            await test.step('Check visibility of Equity', async()=>{
                let balance = await app.mainPage.getBalanceValue('Equity')
                expect(Number(balance)).toBeGreaterThanOrEqual(0)
                expect(balance).not.toBeNaN()
                expect(balance).not.toBeUndefined()
            })
            await test.step('Check visibility of Available', async()=>{
                let balance = await app.mainPage.getBalanceValue('Available')
                expect(Number(balance)).toBeGreaterThanOrEqual(0)
                expect(balance).not.toBeNaN()
                expect(balance).not.toBeUndefined()
            })})
    }
})

test.describe('WEB', async()=>{
    type userDemoCapital = {
        brand: string,
        user: string,
        step1Name: string,
        step2Name: string,
        step3Name: string,
        step4Name: string
    }
    const userDemoParams: userDemoCapital[] = [
        {brand:'@Capital', user:'leadCapital@naga.com', step1Name:'NAGA Start', step2Name:'Deposit', step3Name:'NAGA Progress', step4Name:'NAGA Ultimate'},
        {brand:'@Africa', user: 'leadAfrica@naga.com', step1Name:'NAGA Start', step2Name:'Deposit', step3Name:'NAGA Progress', step4Name:'NAGA Ultimate'}
    ]

    for(const{brand, user, step1Name, step2Name, step3Name, step4Name} of userDemoParams){
        test(`${brand} Visibility of kyc widget for lead user`, {tag:['@UI', '@web','@smoke']}, async({AppNAGA, app})=>{
            await test.step(`Login to platform by ${user}, ${brand} brand`, async()=>{
                await app.signIn.goto(AppNAGA, 'login')
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            })
            await test.step('Check widget on main page', async()=>{
                await app.mainPage.openBackMenuPoint('feed')
                expect(await app.mainPage.checkWidgetStepNotFinishedVisibility(step1Name, 'active')).toBeTruthy
                expect(await app.mainPage.checkWidgetStepNotFinishedVisibility(step2Name, 'next')).toBeTruthy
                expect(await app.mainPage.checkWidgetStepNotFinishedVisibility(step3Name, 'next')).toBeTruthy
                expect(await app.mainPage.checkWidgetStepNotFinishedVisibility(step4Name, 'next')).toBeTruthy
            })
            await test.step("Check widget after lead user tryes to open manage funds", async()=>{
                await app.mainPage.clickBackMenuPoint('Manage Funds')
                expect(await app.mainPage.checkPopupWidgetStepTitleVisibility(step1Name, 'active')).toBeTruthy
                expect(await app.mainPage.checkPopupWidgetStepTitleVisibility(step2Name, 'next')).toBeTruthy
                expect(await app.mainPage.checkPopupWidgetStepTitleVisibility(step3Name, 'next')).toBeTruthy
                expect(await app.mainPage.checkPopupWidgetStepTitleVisibility(step4Name, 'next')).toBeTruthy
                await app.mainPage.closeModal()
            })
            await test.step('Check widget after user opens My Account->Profile status', async()=>{
                await app.myAccounts.openUserMenu()
                await app.myAccounts.openMyAccountMenuItem('Profile Status')
                expect(await app.mainPage.checkPopupWidgetStepTitleVisibility(step1Name, 'active')).toBeTruthy
                expect(await app.mainPage.checkPopupWidgetStepTitleVisibility(step2Name, 'next')).toBeTruthy
                expect(await app.mainPage.checkPopupWidgetStepTitleVisibility(step3Name, 'next')).toBeTruthy
                expect(await app.mainPage.checkPopupWidgetStepTitleVisibility(step4Name, 'next')).toBeTruthy
                await app.mainPage.closeModal()
            })})
    }

    const userDemoParamsMarkets: userDemoCapital[] = [
        {brand:'@Markets', user:'leadMarkets@naga.com', step1Name:'Upgrade to Live', step2Name:'Deposit', step3Name:'Verify Identity', step4Name:'none'},
        {brand:'@Mena', user:'leadMena@naga.com', step1Name:'Upgrade to Live', step2Name:'Deposit', step3Name:'Verify Identity', step4Name:'none'}
    ]
    for(const{brand, user, step1Name, step2Name, step3Name, step4Name} of userDemoParamsMarkets){
        test(`${brand} Visibility of kyc widget per lead user`, {tag:['@UI', '@web','@smoke']}, async({AppNAGA, app})=>{
            await test.step(`Login to platform by ${user}, ${brand} brand`, async()=>{
                await app.signIn.goto(AppNAGA, 'login')
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            })
            await test.step('Check widget on main page', async()=>{
                await app.mainPage.openBackMenuPoint('feed')
                expect(await app.mainPage.checkWidgetStepNotFinishedVisibility(step1Name, 'active')).toBeTruthy
                expect(await app.mainPage.checkWidgetStepNotFinishedVisibility(step2Name, 'next')).toBeTruthy
                expect(await app.mainPage.checkWidgetStepNotFinishedVisibility(step3Name, 'next')).toBeTruthy
            })
            await test.step("Check widget after lead user tryes to open manage funds", async()=>{
                await app.mainPage.clickBackMenuPoint('Manage Funds')
                expect(await app.mainPage.checkPopupWidgetStepTitleVisibility(step1Name, 'active')).toBeTruthy
                expect(await app.mainPage.checkPopupWidgetStepTitleVisibility(step2Name, 'next')).toBeTruthy
                expect(await app.mainPage.checkPopupWidgetStepTitleVisibility(step3Name, 'next')).toBeTruthy
                await app.mainPage.closeModal()
            })
            await test.step('Check widget after user opens My Account->Profile status', async()=>{
                await app.myAccounts.openUserMenu()
                await app.myAccounts.openMyAccountMenuItem('Profile Status')
                expect(await app.mainPage.checkPopupWidgetStepTitleVisibility(step1Name, 'active')).toBeTruthy
                expect(await app.mainPage.checkPopupWidgetStepTitleVisibility(step2Name, 'next')).toBeTruthy
                expect(await app.mainPage.checkPopupWidgetStepTitleVisibility(step3Name, 'next')).toBeTruthy
                await app.mainPage.closeModal()
            })})
    }})

test.describe('WEB', async()=>{

    type brandTypes = {
        brand: string,
        user: string,
    }
    const brandParams: brandTypes[] = [
        {brand:'@Capital', user:'testTrading2'},
        {brand:'@Markets', user:'testTrading2Markets'},
        {brand:'@Mena', user:'testTrading@naga.com'},
        {brand:'@Africa', user:'testTradingAfrica2@naga.com'},
    ]
    for(const{brand, user} of brandParams){
        test(`${brand} Check visibility of quotes on All instruments page`, 
            {tag:['@UI', '@web', '@smoke']}, async({app, AppNAGA})=>{
        await test.step(`Login to platform by ${user}, ${brand} brand`, async()=>{
            await app.signIn.goto(AppNAGA, 'login')
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
        })
        await test.step('Open all insturments page and check that quotes for SELL  are visible', async()=>{
            await app.mainPage.openBackMenuCategory('Trade')
            await app.instruments.searchInstrument('SOLUSD')
            let SellPrice = await app.instruments.getInstrumentQuote('SOLUSD', 'SELL')
            expect(await SellPrice).not.toEqual('-')
            expect(await SellPrice).not.toEqual('NaN')
            expect(await SellPrice).not.toEqual('nulll')
        })
        await test.step('Check Buy quotes', async()=>{
            let BuyPrice = await app.instruments.getInstrumentQuote('SOLUSD', 'BUY')
            expect(await BuyPrice).not.toEqual('-')
            expect(await BuyPrice).not.toEqual('NaN')
            expect(await BuyPrice).not.toEqual('nulll')
        })
    })
    }
})


