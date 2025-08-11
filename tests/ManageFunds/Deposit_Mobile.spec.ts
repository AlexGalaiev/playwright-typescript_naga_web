import { expect } from "@playwright/test";
import { test } from "../../test-options";

test.describe('Deposit Mobile', async()=>{
    
    type depositNumber = {
        numberOfDepositMethods: number,
        brand: string,
        user: string
    }
    const testDepositNumber: depositNumber[] = [
        {numberOfDepositMethods:8, brand: '@Markets', user: 'depositTestMarkets'},
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

})


test.describe('Deposit Mobile. NM. Other methods', async()=>{

    test(`Mobile Check Pay Pal deposit`, 
        {tag:['@deposit', '@mobile', '@manageFunds']}, 
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
        {tag:['@deposit', '@mobile', '@manageFunds']}, 
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

       