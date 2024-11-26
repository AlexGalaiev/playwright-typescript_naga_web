import { expect } from "playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { InternalTransfer } from "../../pageObjects/ManageFunds/InternalTransfer";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
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
    test(`${testRailId} Internal transfer funds ${brand}`, {tag:['@manageFunds', '@prodSanity']}, async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 30000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        let internalTransfer = new InternalTransfer(page);
        await test.step("Login to platform", async()=>{
            await signIn.goto(await signIn.chooseBrand(brand),'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        });
        await test.step("Make internal transfer", async()=>{
            await mainPage.openBackMenuPoint('Manage Funds');
            await internalTransfer.openInternalTransferPage();
            await internalTransfer.chooseAccount('AccountSource');
            await internalTransfer.make1$InternalTransfer();
            expect(await internalTransfer.checkSuccessPopupText()).toContain("You have successufuly transfered")
        })
    })
}
