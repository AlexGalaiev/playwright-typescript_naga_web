import { expect } from "@playwright/test";
import { test } from "../../test-options";

test.describe('Deposit Mobile', async()=>{
    
    type depositNumber = {
        numberOfDepositMethods: number,
        brand: string,
        user: string
    }
    const testDepositNumber: depositNumber[] = [
        {numberOfDepositMethods:6, brand: '@Capital', user: 'testTrading2'},
        {numberOfDepositMethods:8, brand: '@Markets', user: 'depositTestMarkets'},
        {numberOfDepositMethods:4, brand: '@Mena', user: 'depositNagaMena@naga.com'},
        {numberOfDepositMethods:5, brand: '@Africa', user: 'depositNagaAfrica'},
    ]
    
    for(const{numberOfDepositMethods, brand, user}of testDepositNumber){
        test(`Mobile ${brand} Check number of exist deposit methods`, 
        {tag:['@deposit', '@mobile', '@manageFunds']}, async({app, AppNAGA})=>{
        await test.step(`Login by ${user} to ${brand} platform and check number of exist methods`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await app.mainPage.openMobileBackMenuPoint('Deposit')
            await app.deposit.checkActiveMobileManageTab('deposit')
            expect(await app.deposit.getNumberOfMobileDeposits()).toEqual(numberOfDepositMethods)
        })
    })
    }

    type NStestTypes = {
        brand: string,
        user: string,
        depositName: string,
        responseMethodKey: string
    }
    
    const testNStestParameters: NStestTypes[] = [
        {brand: '@Capital', user: 'testTrading2', depositName: 'light-credit-debit-cards', responseMethodKey:'Credit Card'}, 
        {brand: '@Capital', user: 'testTrading2', depositName: 'light-neteller', responseMethodKey:'altneteller'},
        {brand: '@Capital', user: 'testTrading2', depositName: 'light-skrill', responseMethodKey:'skrill'},
        {brand: '@Mena', user: 'depositNagaMena@naga.com', depositName: 'light-credit-debit-cards', responseMethodKey:'Credit Card'},
        {brand: '@Mena', user: 'depositNagaMena@naga.com', depositName: 'light-ecommpay', responseMethodKey:'Credit Card'},
        {brand: '@Mena', user: 'depositNagaMena@naga.com', depositName: 'light-cc-applepay', responseMethodKey:'altcreditcard'},
        {brand: '@Mena', user: 'depositNagaMena@naga.com', depositName: 'light-neteller', responseMethodKey:'Credit Card'},
        {brand: '@Africa', user: 'depositNagaAfrica', depositName: 'light-credit-debit-cards', responseMethodKey:'Credit Card'},
        {brand: '@Africa', user: 'depositNagaAfrica', depositName: 'light-ozow', responseMethodKey:'ozow'},
        {brand: '@Africa', user: 'depositNagaAfrica', depositName: 'light-ecommpay', responseMethodKey:'Credit Card'},
    ]
    
    for(const{brand, user, depositName,responseMethodKey} of testNStestParameters){
    test(`Mobile  ${brand} Deposit with ${depositName} deposit`, 
        {tag:['@deposit', '@mobile', '@manageFunds'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, 
        async({app,AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 45000);
        await test.step(`Login by ${user} to platfrom ${brand}`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await app.mainPage.openMobileBackMenuPoint('Deposit')
        });
        await test.step(`Check ${depositName} deposit`, async()=>{
            await app.deposit.checkActiveMobileManageTab('deposit')
            let response = await app.deposit.performMobileDepositWithAmount(depositName, '100', '**/api/cashier/get-payment-method-list-without-details')
            expect(await app.deposit.getApiPaymentMethodKey(response)).toEqual(responseMethodKey)
            expect(await app.deposit.getApiStatusCode(response)).toEqual(200)
        })
    })}
})

test.describe('Deposit Mobile. NS Other methods', async()=>{

    test.beforeEach(`Login by testTrading2 to platform`, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000);
        await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform("testTrading2", process.env.USER_PASSWORD || '');
        });
    })

    test("Mobile Deposit via Crypto", 
        {tag:['@deposit', '@mobile', '@manageFunds'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}},async({app})=>{
        await app.mainPage.openMobileBackMenuPoint('Deposit')
        await app.deposit.checkActiveMobileManageTab('deposit')
        await test.step("Check crypto deposit", async()=>{
            let response = await app.deposit.performMobileDepositWithAmount('crypto', '100', 'https://payapi.newagecrypto.com/assets/paynow');
            expect(await app.deposit.getApiStatusCode(response)).toEqual(200)
        })
    })

    test('Mobile Deposit via Wire Transfer',
        {tag:['@deposit', '@mobile', '@manageFunds'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, async({app})=>{
        await app.mainPage.openMobileBackMenuPoint('Deposit')
        await app.deposit.checkActiveMobileManageTab('deposit')
        await test.step('Check wire trannsfer deposit', async()=>{
            let response = await app.deposit.performMobileDepositWithoutAmount('amazonaws', '**/payment/bank_accounts')
            expect(await app.deposit.getSuccessStatus(response)).toEqual(true)
            expect(await app.deposit.getInfoCode(response)).toEqual(200)
        })
    })
})

test.describe('Deposit Mobile. NM. Other methods', async()=>{

    test(`Mobile Check Pay Pal deposit`, 
        {tag:['@deposit', '@mobile', '@manageFunds'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, 
        async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000);
        await test.step(`Login to platform by depositTestMarkets user`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform('depositTestMarkets', process.env.USER_PASSWORD || '');
            await app.mainPage.openMobileBackMenuPoint('Deposit')
            await app.deposit.checkActiveMobileManageTab('deposit')
        })
        await test.step('Check Pay Pal deposit', async()=>{
            let response = await app.deposit.performMobileDepositWithAmount('paypal', '100', '**/payments/paypal/deposit_uri')
            expect(await app.deposit.getApiStatusCode(response)).toEqual(200)
            expect(await app.deposit.getCurrentUrl()).toContain('https://www.paypal.com/')
        })
    })

    type NMtestTypes = {
        brand: string,
        user: string,
        depositName: string,
        requestURL: string,
    }

    const NMdepositTestParams: NMtestTypes[] = [
        {brand: '@Markets', user: 'depositTestMarkets', depositName: 'light-credit-debit-cards', requestURL: '**/payment/safecharge/url'},
        {brand: '@Markets', user: 'depositTestMarkets', depositName: 'light-sepa', requestURL: '**/payments/truelayer/providers'}
    ]
    
    for(const{brand, user, depositName, requestURL} of NMdepositTestParams){    
        test(`Mobile ${brand} Check ${depositName} deposit`, 
        {tag:['@deposit', '@mobile', '@manageFunds'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, 
        async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 20000);
        await test.step(`Login by ${user} user`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await app.mainPage.openMobileBackMenuPoint('Deposit')
            await app.deposit.checkActiveMobileManageTab('deposit')
        });
        await test.step(`Check ${depositName} deposit`, async()=>{
            let response = await app.deposit.performMobileDepositWithoutAmount(depositName, requestURL)
            expect(await app.deposit.getSuccessStatus(response)).toEqual(true)
            expect(await app.deposit.getInfoCode(response)).toEqual(200)
        })
    })
    }
})

       