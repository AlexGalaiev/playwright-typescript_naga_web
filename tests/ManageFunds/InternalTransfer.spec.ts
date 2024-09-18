import { expect } from "playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { InternalTransfer } from "../../pageObjects/ManageFunds/InternalTransfer";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import {test} from "../../test-options"

type testTransfer = {
    testRailId: string,
    user: string,
    brand: string
}
const testTransferParams: testTransfer[] = [
    {testRailId: '@23961', brand: '@NS', user: 'testTrading3'},
    {testRailId: '@25149', brand: '@NM', user: 'testTrading3Markets'}
]
for(const{testRailId, brand, user} of testTransferParams){
    test(`${testRailId} Internal transfer funds ${brand}`, {tag:['@smoke', '@manageFunds']}, async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 30000);
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page);
        let internalTransfer = new InternalTransfer(page);
        await test.step("Login to platform", async()=>{
            await sighIn.goto(await sighIn.chooseBrand(brand),'login');
            await sighIn.sigInUserToPlatform(user, process.env.USER_PASSWORD || '');
        });
        await test.step("Make internal transfer", async()=>{
            await mainPage.openManageFunds();
            await internalTransfer.openInternalTransferPage();
            await internalTransfer.chooseAccount('AccountSource');
            await internalTransfer.make1$InternalTransfer();
            expect(await internalTransfer.checkSuccessPopupText()).toContain("You have successufuly transfered")
        })
    })
}
