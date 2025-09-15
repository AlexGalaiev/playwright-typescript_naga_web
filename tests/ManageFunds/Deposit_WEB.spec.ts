import { expect } from "@playwright/test";
import {test} from "../../test-options"

test.describe('Deposit', async()=>{
    
    type AfricaPraxisTypes = {
        brand: string,
        user: string,
        deposit: string[]
    }
    
    const AfricaTestParams: AfricaPraxisTypes[] = [
        {brand: '@Africa', user: 'depositNagaAfrica', deposit: [ 'Credit Card', 'ozow', 'skrill', 'altbankwire' ]},
        {brand: '@Mena', user: 'depositNagaMena@naga.com', deposit: [ 'Credit Card', 'monetix', 'altbankwire', 'applepay', 'google pay' ]},
        {brand: '@Capital', user: 'testTrading2', deposit: [ 'Credit Card', 'skrill', 'altneteller', 'bank transfer', 'crypto' ]},
        {brand: '@Markets', user: 'depositTestMarkets', deposit: [ 'Credit Card','OpenBanking','VoltConnect','altbankwire','klarna','paypal','truelayer','skrill']},
    ]
    for(const{brand, user, deposit,} of AfricaTestParams){
    test(`${brand} Check praxis popup deposit methods`, {tag:['@deposit', '@prodSanity', '@manageFunds', '@smoke','@web','@lightTests']}, 
        async({app,AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 45000)
        await test.step(`Login by ${user} to platfrom ${brand}`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step('Open Manage Funds subcategory, and check praxis popup deposit url', async()=>{
            let depositResponse = await app.mainPage.openPraxisDepositPopupFromManageFunds('Manage Funds','Deposit','**/api/cashier/get-payment-method-list-without-details')
            let payments = await app.deposit.praxisPopupPayments(depositResponse)
            expect(payments.sort()).toEqual(deposit.sort())
            expect(await app.deposit.getPraxisPopupStatusCode(depositResponse)).toEqual(200)
        })})
    }
}) 
