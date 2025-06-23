import { expect } from "@playwright/test";
import {test} from "../../test-options"

test.describe('Deposit', async()=>{
    type depositNumber = {
        numberOfDepositMethods: number,
        brand: string,
        user: string
    }
    const testDepositNumber: depositNumber[] = [
        {numberOfDepositMethods:5, brand: '@Capital', user: 'testTrading2'},
        {numberOfDepositMethods:8, brand: '@Markets', user: 'depositTestMarkets'},
        {numberOfDepositMethods:4, brand: '@Mena', user: 'depositNagaMena@naga.com'},
        {numberOfDepositMethods:5, brand: '@Africa', user: 'depositNagaAfrica'},
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

    type NStestTypes = {
        brand: string,
        user: string,
        depositName: string,
        responseMethodKey: string
    }
    
    const testNStestParameters: NStestTypes[] = [
        {brand: '@Capital', user: 'testTrading2', depositName: 'light-credit-debit-cards', responseMethodKey:'Credit Card'}, 
        //{testRailId: '@24067', brand: '@Markets', user: 'testTrading2', depositName: 'perfectmoney', responseMethodKey:'Fund via Perfect Money'},
        {brand: '@Capital', user: 'testTrading2', depositName: 'light-neteller', responseMethodKey:'altneteller'},
        {brand: '@Capital', user: 'testTrading2', depositName: 'light-skrill', responseMethodKey:'skrill'},
        {brand: '@Mena', user: 'depositNagaMena@naga.com', depositName: 'light-credit-debit-cards', responseMethodKey:'Credit Card'},
        {brand: '@Mena', user: 'depositNagaMena@naga.com', depositName: 'light-ecommpay', responseMethodKey:'Credit Card'},
        {brand: '@Mena', user: 'depositNagaMena@naga.com', depositName: 'light-cc-applepay', responseMethodKey:'altcreditcard'},
        {brand: '@Mena', user: 'depositNagaMena@naga.com', depositName: 'light-neteller', responseMethodKey:'Credit Card'},
        //{testRailId: '@24077', brand: '@Capital', user: 'testTrading2', depositName: 'match2pay', responseMethodKey:'altcrypto'},
    ]
    for(const{ brand, user, depositName,responseMethodKey} of testNStestParameters){
        test(`${brand} Deposit with ${depositName} deposit`, 
            {tag:['@deposit', '@prodSanity', '@manageFunds', '@smoke','@web'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, 
            async({app,AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 45000)
            await test.step(`Login by ${user} to platfrom ${brand}`, async()=>{
                await app.signIn.goto(AppNAGA,'login');
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
                await app.mainPage.openBackMenuSubcategory('Manage Funds', 'Deposit');
            })
            await test.step(`Check ${depositName} deposit`, async()=>{
                let response = await app.deposit.performDepositWithAmount(depositName, '100', '**/api/cashier/get-payment-method-list-without-details')
                expect(await app.deposit.getApiPaymentMethodKey(response)).toEqual(responseMethodKey)
                expect(await app.deposit.getApiStatusCode(response)).toEqual(200)
            })
        })}
    
    type AfricaPraxisTypes = {
        brand: string,
        user: string,
        deposit: string[]
    }
    
    const AfricaTestParams: AfricaPraxisTypes[] = [
        {brand: '@Africa', user: 'depositNagaAfrica', deposit: [ 'Credit Card', 'ozow', 'skrill', 'altbankwire' ]},
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

    test.beforeEach(`Login by testTrading2 to platform`, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000);
        await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform("testTrading2", process.env.USER_PASSWORD || '');
        });
    })

    test("Deposit via Crypto", {tag:['@deposit', '@manageFunds','@web']}, async({app})=>{
        await app.mainPage.openBackMenuSubcategory('Manage Funds', 'Deposit');
        await test.step("Check crypto deposit", async()=>{
            let response = await app.deposit.performDepositWithAmount('crypto', '100', 'https://payapi.newagecrypto.com/assets/paynow');
            expect(await app.deposit.getApiStatusCode(response)).toEqual(200)
        })
    })
    test('Deposit via Wire Transfer',{tag:['@deposit', '@manageFunds','@web'], 
        annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, async({app})=>{
        await app.mainPage.openBackMenuSubcategory('Manage Funds', 'Deposit');
        await test.step('Check wire trannsfer deposit', async()=>{
            let response = await app.deposit.performDepositWithoutAmount('amazonaws', '**/payment/bank_accounts')
            expect(await app.deposit.getSuccessStatus(response)).toEqual(true)
            expect(await app.deposit.getInfoCode(response)).toEqual(200)
        })})
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