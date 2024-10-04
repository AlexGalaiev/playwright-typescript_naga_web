import { SighIn } from "../../pageObjects/SighIn/SignInPage"
import {MainPage} from "../../pageObjects/MainPage/MainPage"
import {test} from "../../test-options"
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts"
import { PageAfterLogout } from "../../pageObjects/common/logOutPopup/PageAfterLogout"
import { expect } from "@playwright/test"
import { getLocalization } from "../../pageObjects/localization/getText"
import { UserProfile } from "../../pageObjects/UserProfile/UserProfile"


test.describe('Main Page elements', async()=>{
    type testTypes = {
        testrailId: string;
        brand: string;
        email: string;
    }
    const testParams: testTypes[] = [
       { testrailId: "@23914", brand: '@NS', email: "testLeadUser"},
       { testrailId: "@23568", brand: '@NM', email: "testLeadUser@i.ua"},
       { testrailId: "@25191", brand: '@NA', email: "testLeadUserAxon@i.ua"}
    ]
    for(const {testrailId, brand, email} of testParams){
        test(`${testrailId} login/logout to platform ${brand}`, {tag:['@smoke', '@signIn', '@prodSanity', '@mainPage']}, async({page})=>{
            let sighIn = new SighIn(page);
            let pageAfterLogOut = new PageAfterLogout(page)
            let myAccountsMenu = new MyAccounts(page)
            await test.step('Login to platform', async()=>{
                await sighIn.goto(await sighIn.chooseBrand(brand), 'login')
                await sighIn.sigInUserToPlatform(email, process.env.USER_PASSWORD || '')
            })
            await test.step('Log out from platform', async()=>{
                await myAccountsMenu.openUserMenu();
                await myAccountsMenu.userLogOut()
                expect(await pageAfterLogOut.getLogOutPageTittle()).toEqual('Trade with NAGA on the go!')
            })
        })
    }

    type searchTypes = {
        testRailId: string;
        brand: string;
        loginUser: string;
        searchUser: string;
        flag: string
    }
    const searchParams: searchTypes[] = [
        {testRailId: '@23693', brand: '@NM', loginUser:'testTrading2Markets', searchUser: 'testTrading2', flag:'ba.png'},
        {testRailId: '@25192', brand: '@NS', loginUser:'testTrading2', searchUser: 'testTrading2Markets', flag:'de.png'}
    ]
    for(const{testRailId, brand, loginUser, searchUser, flag} of searchParams){
        test(`${testRailId} Search different customers`, {tag: ['@signIn', '@mainPage']},async({page})=>{
            let sighIn = new SighIn(page);
            let mainPage = new MainPage(page)
            let userProfile = new UserProfile(page)
            await test.step('Login to platform', async()=>{
                await sighIn.goto(await sighIn.chooseBrand(brand), 'login')
                await sighIn.sigInUserToPlatform(loginUser, process.env.USER_PASSWORD || '')
            })
            await test.step('Search and open different user from different platform', async()=>{
                await mainPage.search(searchUser)
                await mainPage.getFoundResults(searchUser)
                expect(await userProfile.getCountryFlag()).toContain(flag)
            })
        })
    }

})
test.describe('Naga Capital', async()=>{
    type testpBannerTypes = {
        email: string;
        numberOfStep: number;
        textOfStep:string
    }
    const testBannerParams: testpBannerTypes[] = [
        {email: "testUserLead@i.ua", numberOfStep: 1, textOfStep:"Complete now"},
        {email: "userHalfRegistered@i.ua", numberOfStep: 2, textOfStep:"Verify identity"},
        {email: "testUserUpgraded@i.ua", numberOfStep:3, textOfStep:"Complete Progress level and verify address"}
    ]
    for(const {email, numberOfStep, textOfStep} of testBannerParams){
    test(`@23926 Status on banner #${numberOfStep}`,{tag:['@signIn', '@mainPage']},  async({page, NagaCapital})=>{
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page)
        await test.step('Login to platform', async()=>{
            await sighIn.goto(NagaCapital, 'login')
            await sighIn.sigInUserToPlatform(email, process.env.USER_PASSWORD || '')
        })
        await test.step('Check statuses of steps', async()=>{
            expect(await mainPage.getStatusTextOfHeaderStep(numberOfStep)).toEqual(textOfStep)
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
        test(`@25190 Naga start login banner ${level}`, async({page, NagaMarkets})=>{
            let sighIn = new SighIn(page);
            let mainPage = new MainPage(page);
            let localization = new getLocalization('/pageObjects/localization/NagaMarkets_MainPage.json')
            await test.step('Login to platform', async()=>{
                await sighIn.goto(NagaMarkets, 'login')
                await sighIn.sigInUserToPlatform(email, process.env.USER_PASSWORD || '')
            })
            await test.step('Check banners with different scorrings', async()=>{
                if(level == 'Lead'){
                    expect(await mainPage.getVerifyBannerContent()).toEqual(await localization.getLocalizationText(textOfStep))
                }else{
                    expect(await mainPage.getVerifyBannerMiddleScore()).toEqual(await localization.getLocalizationText(textOfStep))
                }
            })
        })
    }

})

