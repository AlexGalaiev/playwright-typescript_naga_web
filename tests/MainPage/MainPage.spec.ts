import { SighIn } from "../../pageObjects/SighIn/SignInPage"
import {MainPage} from "../../pageObjects/MainPage/MainPage"
import {test} from "../../test-options"
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts"
import { PageAfterLogout } from "../../pageObjects/common/logOutPopup/PageAfterLogout"
import { expect } from "@playwright/test"
import { getLocalization } from "../../pageObjects/localization/getText"


test.describe('Main Page elements', async()=>{
    type testTypes = {
        testrailId: string;
        brand: string;
        email: string;
    }
    const testParams: testTypes[] = [
       { testrailId: "@23914", brand: '@NS', email: "testLeadUser"},
       { testrailId: "@23568", brand: '@NM', email: "testLeadUser@i.ua"}
    ]
    for(const {testrailId, brand, email} of testParams){
        test(`${testrailId} login to platform ${brand}`, {tag:['@smoke', '@signIn']}, async({page})=>{
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
    }})
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
    test(`@23926 Status on banner #${numberOfStep}`,{tag:'@signIn'},  async({page, NagaCapital})=>{
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

