import { expect } from "playwright/test";
import {test} from "../../test-options"


test.describe('Funds transfer', async()=>{
    type testTransfer = {
        user: string,
        brand: string
    }
    const testTransferParams: testTransfer[] = [
        {brand: '@Capital', user: 'testTrading3'},
        {brand: '@Markets', user: 'testTrading3Markets'},
        {brand: '@Mena', user: 'testTrading2Mena@naga.com'},
        {brand: '@Africa', user: 'testTradingAfrica2@naga.com'}
    ]
    for(const{ brand, user} of testTransferParams){
        test(`Internal transfer funds ${brand}`, 
            {tag:['@manageFunds', '@prodSanity', "@internalTransfer",'@web']}, async({app, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 45000);
            await test.step(`Login to ${brand} platform by ${user} user`, async()=>{
                await app.signIn.goto(AppNAGA,'login');
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            });
            await test.step("Make internal transfer", async()=>{
                await app.mainPage.openBackMenuSubcategory('Manage Funds', 'Transfer');
                await app.internalTransfer.chooseAccount('AccountSource', 'AccountDirection');
                await app.internalTransfer.make1$InternalTransfer();
                expect(await app.internalTransfer.checkSuccessPopupText()).toContain("You have successufuly transfered")
            })
        })}
})
