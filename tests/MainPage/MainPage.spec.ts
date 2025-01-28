import { SignIn } from "../../pageObjects/SignIn/SignInPage"
import {MainPage} from "../../pageObjects/MainPage/MainPage"
import {test} from "../../test-options"
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts"
import { PageAfterLogout } from "../../pageObjects/common/logOutPopup/PageAfterLogout"
import { expect } from "@playwright/test"
import { getLocalization } from "../../pageObjects/localization/getText"
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
        test(`${testRailId} Search functionality`, {tag: '@UI'},async({page})=>{
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page)
            let userProfile = new UserProfile(page)
            await test.step(`Login to platform by ${loginUser}`, async()=>{
                await signIn.goto(await signIn.chooseBrand(brand), 'login')
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
    test(`@23926 Status on widget step ${email}`,{tag: '@UI'}, async({page, NagaCapital})=>{
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page)
        await test.step(`Login to platform by ${email}`, async()=>{
            await signIn.goto(NagaCapital, 'login')
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
        test(`@25190 Naga start login banner ${stepName}`,{tag: '@UI'}, async({page, NagaMarkets})=>{
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page);
            await test.step('Login to platform', async()=>{
                await signIn.goto(NagaMarkets, 'login')
                await signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || '')
            })
            await test.step('Check banners with different scorrings', async()=>{
                expect(await mainPage.getTextOfWidgetStep(stepName)).toEqual(textOfStep)
            })
        })}
})

