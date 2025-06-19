import { expect } from "@playwright/test";
import { test } from "../../test-options";

type testTransfer = {
    user: string,
    brand: string
}
const testTransferParams: testTransfer[] = [
    {brand: '@Capital', user: 'testTrading3'},
    {brand: '@Markets', user: 'testTrading3Markets'},
    {brand: '@Mena', user: 'testTrading2Mena@naga.com'},
    {brand: '@Africa', user: 'testTradingAfrica@naga.com'}
]
for(const{brand, user} of testTransferParams){
    test(`Mobile Internal transfer funds ${brand}`, 
        {tag:['@internalTransfer','@mobile', '@manageFunds']}, async({app,AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 30000)
        await test.step(`Login to ${brand} platform by ${user} user`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        });
        await test.step("Make internal transfer", async()=>{
            await app.mainPage.openMobileBackMenuPoint('Transfer')
            await app.deposit.checkActiveMobileManageTab('transfer')
            await app.internalTransfer.chooseAccount('AccountSource', 'AccountDirection');
            await app.internalTransfer.make1$InternalTransfer();
            expect(await app.internalTransfer.checkSuccessPopupText()).toContain("You have successufuly transfered")
        })
    })
}