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
        {testRailId: '@23593', brand: '@NM', loginUser:'testTrading2Markets', searchUser: 'testTrading2', flag:'ba.png'},
        {testRailId: '@25192', brand: '@NS', loginUser:'testTrading2', searchUser: 'testTrading2Markets', flag:'de.png'}
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
        level: string
    }
    const testBannerParams: testpBannerTypes[] = [
        {email: "testUserLeadMarkets@i.ua", textOfStep: "UpgradeAccountBannerContent", level: 'Lead'},
        {email: "user949", textOfStep:"PreAdvanceDisclaimerBody", level: 'PreAdvance'},
        {email: "user460", textOfStep:"PreAdvanceDisclaimerBody", level: 'Beginner'},
    ]
    for(const{email, textOfStep, level} of testBannerParams){
        test(`@25190 Naga start login banner ${level}`,{tag: '@UI'}, async({page, NagaMarkets})=>{
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page);
            let localization = new getLocalization('/pageObjects/localization/NagaMarkets_MainPage.json')
            await test.step('Login to platform', async()=>{
                await signIn.goto(NagaMarkets, 'login')
                await signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || '')
            })
            await test.step('Check banners with different scorrings', async()=>{
                if(level == 'Lead'){
                    expect(await mainPage.getVerifyBannerContent()).toEqual(await localization.getLocalizationText(textOfStep))
                }else{
                    expect(await mainPage.getVerifyBannerMiddleScore()).toEqual(await localization.getLocalizationText(textOfStep))
                }})
        })}
    })


