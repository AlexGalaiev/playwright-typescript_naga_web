import { expect } from "@playwright/test";
import {test} from "../../test-options"

test.describe('Deposit', async()=>{
    type depositNumber = {
        numberOfDepositMethods: number,
        brand: string,
        user: string
    }
    const testDepositNumber: depositNumber[] = [
        //{numberOfDepositMethods:5, brand: '@Capital', user: 'testTrading2'},
        {numberOfDepositMethods:8, brand: '@Markets', user: 'depositTestMarkets'},
        //{numberOfDepositMethods:4, brand: '@Mena', user: 'depositNagaMena@naga.com'},
        //{numberOfDepositMethods:5, brand: '@Africa', user: 'depositNagaAfrica'},
    ]
    for(const{numberOfDepositMethods, brand, user}of testDepositNumber){
        test(`WEB ${brand} Check number of exist deposit methods`, 
            {tag:['@deposit', '@manageFunds','@web'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, 
            async({app, AppNAGA})=>{
            await test.step(`Login by ${user} to ${brand} platform and check number of exist methods`, async()=>{
                await app.signIn.goto(AppNAGA,'login');
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
                await app.mainPage.openBackMenuSubcategory('Manage Funds', 'Deposit');
                expect(await app.deposit.getNumberOfDepositMethods()).toEqual(numberOfDepositMethods)
            })})
    }
})

test.describe('Deposit', async()=>{
    
    type AfricaPraxisTypes = {
        brand: string,
        user: string,
        deposit: string[]
    }
    
    const AfricaTestParams: AfricaPraxisTypes[] = [
        {brand: '@Africa', user: 'depositNagaAfrica', deposit: [ 'Credit Card', 'ozow', 'skrill', 'altbankwire' ]},
        {brand: '@Mena', user: 'depositNagaMena@naga.com', deposit: [ 'Credit Card', 'monetix', 'altcreditcard', 'altbankwire', 'applepay', 'google pay' ]},
        {brand: '@Capital', user: 'testTrading2', deposit: [ 'Credit Card', 'skrill', 'altneteller', 'bank transfer' ]},
    ]
    for(const{brand, user, deposit,} of AfricaTestParams){
    test(`${brand} Check praxis popup deposit methods`, {tag:['@deposit', '@prodSanity', '@manageFunds', '@smoke','@web'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, 
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

test.describe('Deposit', async()=>{
    
    type NMtestTypes = {
        brand: string,
        user: string,
        depositName: string,
        requestURL: string,
    }

    test(`Check Pay Pal deposit`, {tag:['@deposit', '@manageFunds','@web'], 
        annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000)
        await test.step(`Login to platform by depositTestMarkets user`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform('depositTestMarkets', process.env.USER_PASSWORD || '');
            await app.mainPage.openBackMenuSubcategory('Manage Funds', 'Deposit');
        })
        await test.step('Check Pay Pal deposit', async()=>{
            let response = await app.deposit.performDepositWithAmount('paypal', '100', '**/payments/paypal/deposit_uri')
            expect(await app.deposit.getApiStatusCode(response)).toEqual(200)
            expect(await app.deposit.getCurrentUrl()).toContain('https://www.paypal.com/')
        })
    })
   

    const NMdepositTestParams: NMtestTypes[] = [
        {brand: '@Markets', user: 'depositTestMarkets', depositName: 'light-credit-debit-cards', requestURL: '**/payment/safecharge/url'},
        {brand: '@Markets', user: 'depositTestMarkets', depositName: 'light-sepa', requestURL: '**/payments/truelayer/providers'}
    ]
    
    for(const{brand, user, depositName, requestURL} of NMdepositTestParams){    
    test(`${brand} Check ${depositName} deposit`, 
        {tag:['@deposit', '@manageFunds', '@smoke','@web'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, async({app,AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 20000)
        await test.step(`Login by ${user} user`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await app.mainPage.openBackMenuSubcategory('Manage Funds', 'Deposit');
        });
        await test.step(`Check ${depositName} deposit`, async()=>{
            let response = await app.deposit.performDepositWithoutAmount(depositName, requestURL)
            expect(await app.deposit.getSuccessStatus(response)).toEqual(true)
            expect(await app.deposit.getInfoCode(response)).toEqual(200)
        })
    })}
})