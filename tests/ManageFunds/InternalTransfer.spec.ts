import { expect } from "playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { InternalTransfer } from "../../pageObjects/ManageFunds/InternalTransfer";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import {test} from "../../test-options"
import { Deposit } from "../../pageObjects/ManageFunds/Deposit";

type testTransfer = {
    testRailId: string,
    user: string,
    brand: string
}
const testTransferParams: testTransfer[] = [
    {testRailId: '@23961', brand: '@Capital', user: 'testTrading3'},
    {testRailId: '@25149', brand: '@Markets', user: 'testTrading3Markets'},
    {testRailId: '@25397', brand: '@Mena', user: 'testTrading2Mena@naga.com'},
    {testRailId: '@25421', brand: '@Africa', user: 'testTradingAfrica@naga.com'}
]
for(const{testRailId, brand, user} of testTransferParams){
    test(`${testRailId} Internal transfer funds ${brand}`, 
        {tag:['@manageFunds', '@prodSanity', "@internalTransfer"]}, async({page}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 30000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        let internalTransfer = new InternalTransfer(page);
        await test.step(`Login to ${brand} platform by ${user} user`, async()=>{
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
    })}

for(const{testRailId, brand, user} of testTransferParams){
    test(`${testRailId} Mobile Internal transfer funds ${brand}`, 
        {tag:['@internalTransfer','@mobile']}, async({page}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 30000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        let internalTransfer = new InternalTransfer(page);
        await test.step(`Login to ${brand} platform by ${user} user`, async()=>{
            await signIn.goto(await signIn.chooseBrand(brand),'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        });
        await test.step("Make internal transfer", async()=>{
            await mainPage.openMobileMenuPoint('Menu');
            await mainPage.openMobileBackMenuPoint('manage-funds')
            await new Deposit(page).checkActiveMobileManageTab('transfer')
            await internalTransfer.chooseAccount('AccountSource');
            await internalTransfer.make1$InternalTransfer();
            expect(await internalTransfer.checkSuccessPopupText()).toContain("You have successufuly transfered")
        })
    })
}
