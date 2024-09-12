import { SighIn } from "../../pageObjects/SighIn/SignInPage"
import {test} from "..//..//test-options"
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts"
import { PageAfterLogout } from "../../pageObjects/common/logOutPopup/PageAfterLogout"
import { expect } from "@playwright/test"


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
        test(`${testrailId} login to platform ${brand}`, {tag:['@smoke', '@other']}, async({page})=>{
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
   
})
