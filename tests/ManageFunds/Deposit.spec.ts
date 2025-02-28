import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { Deposit } from "../../pageObjects/ManageFunds/Deposit";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import {test} from "../../test-options"

test.describe('Deposit', async()=>{
    type depositNumber = {
        testRaildId: string,
        numberOfDepositMethods: number,
        brand: string,
        user: string
    }
    const testDepositNumber: depositNumber[] = [
        {testRaildId: '@25351', numberOfDepositMethods:6, brand: '@Capital', user: 'testTrading2'},
        {testRaildId: '@25391', numberOfDepositMethods:8, brand: '@Markets', user: 'depositTestMarkets'},
        {testRaildId: '@25392', numberOfDepositMethods:4, brand: '@Mena', user: 'depositNagaMena@naga.com'},
        {testRaildId: '@25422', numberOfDepositMethods:5, brand: '@Africa', user: 'depositNagaAfrica'},
    ]
    for(const{testRaildId, numberOfDepositMethods, brand, user}of testDepositNumber){
        test(`${testRaildId} WEB ${brand} Check number of exist deposit methods`, 
            {tag:['@deposit', '@manageFunds','@web']}, async({page})=>{
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page);
            let deposit = new Deposit(page);
            await test.step(`Login by ${user} to ${brand} platform and check number of exist methods`, async()=>{
                await signIn.goto(await signIn.chooseBrand(brand),'login');
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
                await mainPage.openBackMenuPoint('Manage Funds');
                await deposit.checkActiveDepositTab('deposit')
                expect(await deposit.getNumberOfDepositMethods()).toEqual(numberOfDepositMethods)
            })})
    }
    for(const{testRaildId, numberOfDepositMethods, brand, user}of testDepositNumber){
        test(`${testRaildId} Mobile ${brand} Check number of exist deposit methods`, 
            {tag:['@deposit', '@mobile']}, async({page})=>{
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page);
            let deposit = new Deposit(page);
            await test.step(`Login by ${user} to ${brand} platform and check number of exist methods`, async()=>{
                await signIn.goto(await signIn.chooseBrand(brand),'login');
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
                await mainPage.openMobileMenuPoint('Menu');
                await mainPage.openMobileBackMenuPoint('manage-funds')
                await deposit.checkActiveMobileManageTab('deposit')
                expect(await deposit.getNumberOfMobileDeposits()).toEqual(numberOfDepositMethods)
            })})
    }
})

test.describe('Deposit', async()=>{

    type NStestTypes = {
        testRailId: string,
        brand: string,
        user: string,
        depositName: string,
        responseMethodKey: string
    }
    
    const testNStestParameters: NStestTypes[] = [
        {testRailId: '@24082', brand: '@Capital', user: 'testTrading2', depositName: 'light-credit-debit-cards', responseMethodKey:'Credit Card'}, 
        //{testRailId: '@24067', brand: '@Markets', user: 'testTrading2', depositName: 'perfectmoney', responseMethodKey:'Fund via Perfect Money'},
        {testRailId: '@24078', brand: '@Capital', user: 'testTrading2', depositName: 'light-neteller', responseMethodKey:'altneteller'},
        {testRailId: '@24077', brand: '@Capital', user: 'testTrading2', depositName: 'light-skrill', responseMethodKey:'skrill'},
        {testRailId: '@25393', brand: '@Mena', user: 'depositNagaMena@naga.com', depositName: 'light-credit-debit-cards', responseMethodKey:'Credit Card'},
        {testRailId: '@25394', brand: '@Mena', user: 'depositNagaMena@naga.com', depositName: 'light-ecommpay', responseMethodKey:'Credit Card'},
        {testRailId: '@25395', brand: '@Mena', user: 'depositNagaMena@naga.com', depositName: 'light-cc-applepay', responseMethodKey:'altcreditcard'},
        {testRailId: '@25396', brand: '@Mena', user: 'depositNagaMena@naga.com', depositName: 'light-neteller', responseMethodKey:'Credit Card'},
        {testRailId: '@25423', brand: '@Africa', user: 'depositNagaAfrica', depositName: 'light-credit-debit-cards', responseMethodKey:'Credit Card'},
        {testRailId: '@25424', brand: '@Africa', user: 'depositNagaAfrica', depositName: 'light-ozow', responseMethodKey:'ozow'},
        {testRailId: '@25425', brand: '@Africa', user: 'depositNagaAfrica', depositName: 'light-ecommpay', responseMethodKey:'Credit Card'},
        //{testRailId: '@24077', brand: '@Capital', user: 'testTrading2', depositName: 'match2pay', responseMethodKey:'altcrypto'},
    ]
    for(const{testRailId, brand, user, depositName,responseMethodKey} of testNStestParameters){
        test(`${testRailId} ${brand} Deposit with ${depositName} deposit`, 
            {tag:['@deposit', '@prodSanity', '@manageFunds', '@smoke','@web']}, async({page}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 45000);
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page);
            let deposit = new Deposit(page);
            await test.step(`Login by ${user} to platfrom ${brand}`, async()=>{
                await signIn.goto(await signIn.chooseBrand(brand),'login');
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
                await mainPage.openBackMenuPoint('Manage Funds');
            });
            await test.step(`Check ${depositName} deposit`, async()=>{
                let response = await deposit.performDepositWithAmount(depositName, '100', '**/api/cashier/get-payment-method-list-without-details')
                expect(await deposit.getApiPaymentMethodKey(response)).toEqual(responseMethodKey)
                expect(await deposit.getApiStatusCode(response)).toEqual(200)
            })
        })}

    for(const{testRailId, brand, user, depositName,responseMethodKey} of testNStestParameters){
        test(`${testRailId} Mobile  ${brand} Deposit with ${depositName} deposit`, 
            {tag:['@deposit', '@mobile']}, async({page}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 45000);
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page);
            let deposit = new Deposit(page);
            await test.step(`Login by ${user} to platfrom ${brand}`, async()=>{
                await signIn.goto(await signIn.chooseBrand(brand),'login');
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
                await mainPage.openMobileMenuPoint('Menu');
            });
            await test.step(`Check ${depositName} deposit`, async()=>{
                await mainPage.openMobileBackMenuPoint('manage-funds')
                await deposit.checkActiveMobileManageTab('deposit')
                let response = await deposit.performMobileDepositWithAmount(depositName, '100', '**/api/cashier/get-payment-method-list-without-details')
                expect(await deposit.getApiPaymentMethodKey(response)).toEqual(responseMethodKey)
                expect(await deposit.getApiStatusCode(response)).toEqual(200)
            })
        })}
}) 
test.describe('Deposit', async()=>{

    test.beforeEach(`Login by testTrading2 to platform`, async({page, NagaCapital}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000);
        let signIn = new SignIn(page);
        await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
            await signIn.goto(NagaCapital,'login');
            await signIn.signInUserToPlatform("testTrading2", process.env.USER_PASSWORD || '');
        });
    })
    test("@24068 Mobile Deposit via Crypto", {tag:['@deposit', '@mobile']}, async({page})=>{
        let deposit = new Deposit(page);
        await new MainPage(page).openMobileMenuPoint('Menu');
        await new MainPage(page).openMobileBackMenuPoint('manage-funds')
        await deposit.checkActiveMobileManageTab('deposit')
        await test.step("Check crypto deposit", async()=>{
            let response = await deposit.performMobileDepositWithAmount('crypto', '100', 'https://payapi.newagecrypto.com/assets/paynow');
            expect(await deposit.getApiStatusCode(response)).toEqual(200)
        })
    })
    test("@24068 Deposit via Crypto", {tag:['@deposit', '@manageFunds','@web']}, async({page})=>{
        let deposit = new Deposit(page);
        await new MainPage(page).openBackMenuPoint('Manage Funds')
        await test.step("Check crypto deposit", async()=>{
            let response = await deposit.performDepositWithAmount('crypto', '100', 'https://payapi.newagecrypto.com/assets/paynow');
            expect(await deposit.getApiStatusCode(response)).toEqual(200)
        })
    })
    test('@25352 Deposit via Wire Transfer',{tag:['@deposit', '@manageFunds','@web']}, async({page})=>{
        let deposit = new Deposit(page)
        await new MainPage(page).openBackMenuPoint('Manage Funds')
        await test.step('Check wire trannsfer deposit', async()=>{
            let response = await deposit.performDepositWithoutAmount('amazonaws', '**/payment/bank_accounts')
            expect(await deposit.getSuccessStatus(response)).toEqual(true)
            expect(await deposit.getInfoCode(response)).toEqual(200)
        })})
    test('@25352 Mobile Deposit via Wire Transfer',{tag:['@deposit', '@mobile']}, async({page})=>{
        let deposit = new Deposit(page)
        await new MainPage(page).openMobileMenuPoint('Menu');
        await new MainPage(page).openMobileBackMenuPoint('manage-funds')
        await deposit.checkActiveMobileManageTab('deposit')
        await test.step('Check wire trannsfer deposit', async()=>{
            let response = await deposit.performMobileDepositWithoutAmount('amazonaws', '**/payment/bank_accounts')
            expect(await deposit.getSuccessStatus(response)).toEqual(true)
            expect(await deposit.getInfoCode(response)).toEqual(200)
        })})
})

test.describe('Deposit', async()=>{
    
    type NMtestTypes = {
        testRailId: string,
        brand: string,
        user: string,
        depositName: string,
        requestURL: string,
    }

    test(`@23995 Check Pay Pal deposit`, {tag:['@deposit', '@manageFunds','@web']}, async({page, NagaMarkets}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        await test.step(`Login to platform by depositTestMarkets user`, async()=>{
            await signIn.goto(NagaMarkets,'login');
            await signIn.signInUserToPlatform('depositTestMarkets', process.env.USER_PASSWORD || '');
            await mainPage.openBackMenuPoint('Manage Funds');
        })
        await test.step('Check Pay Pal deposit', async()=>{
            let deposit = new Deposit(page);
            let response = await deposit.performDepositWithAmount('paypal', '100', '**/payments/paypal/deposit_uri')
            expect(await deposit.getApiStatusCode(response)).toEqual(200)
            expect(await deposit.getCurrentUrl()).toContain('https://www.paypal.com/')
        })
    })
    test(`@23995 Mobile Check Pay Pal deposit`, 
        {tag:['@deposit', '@mobile']}, async({page, NagaMarkets}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        await test.step(`Login to platform by depositTestMarkets user`, async()=>{
            await signIn.goto(NagaMarkets,'login');
            await signIn.signInUserToPlatform('depositTestMarkets', process.env.USER_PASSWORD || '');
            await mainPage.openMobileMenuPoint('Menu');
            await mainPage.openMobileBackMenuPoint('manage-funds')
            await new Deposit(page).checkActiveMobileManageTab('deposit')
        })
        await test.step('Check Pay Pal deposit', async()=>{
            let deposit = new Deposit(page);
            let response = await deposit.performMobileDepositWithAmount('paypal', '100', '**/payments/paypal/deposit_uri')
            expect(await deposit.getApiStatusCode(response)).toEqual(200)
            expect(await deposit.getCurrentUrl()).toContain('https://www.paypal.com/')
        })
    })

    const NMdepositTestParams: NMtestTypes[] = [
        {testRailId: '@23606', brand: '@Markets', user: 'depositTestMarkets', depositName: 'light-credit-debit-cards', requestURL: '**/payment/safecharge/url'},
        {testRailId: '@25151', brand: '@Markets', user: 'depositTestMarkets', depositName: 'light-ewallet', requestURL: '**/payment/safecharge/url'},
        {testRailId: '@25150', brand: '@Markets', user: 'depositTestMarkets', depositName: 'light-sepa', requestURL: '**/payments/truelayer/providers'}    ]
    for(const{testRailId, brand, user, depositName, requestURL} of NMdepositTestParams){    
        test(`${testRailId} ${brand} Check ${depositName} deposit`, 
            {tag:['@deposit', '@manageFunds', '@smoke','@web']}, async({page}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 20000);
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page);
            let deposit = new Deposit(page);
            await test.step(`Login by ${user} user`, async()=>{
                await signIn.goto(await signIn.chooseBrand(brand),'login');
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
                await mainPage.openBackMenuPoint('Manage Funds');
            });
            await test.step(`Check ${depositName} deposit`, async()=>{
                let response = await deposit.performDepositWithoutAmount(depositName, requestURL)
                expect(await deposit.getSuccessStatus(response)).toEqual(true)
                expect(await deposit.getInfoCode(response)).toEqual(200)
            })
        })}
    
    for(const{testRailId, brand, user, depositName, requestURL} of NMdepositTestParams){    
        test(`${testRailId} Mobile ${brand} Check ${depositName} deposit`, 
            {tag:['@deposit', '@mobile']}, async({page}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 20000);
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page);
            let deposit = new Deposit(page);
            await test.step(`Login by ${user} user`, async()=>{
                await signIn.goto(await signIn.chooseBrand(brand),'login');
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
                await mainPage.openMobileMenuPoint('Menu');
                await mainPage.openMobileBackMenuPoint('manage-funds')
                await new Deposit(page).checkActiveMobileManageTab('deposit')
            });
            await test.step(`Check ${depositName} deposit`, async()=>{
                let response = await deposit.performMobileDepositWithoutAmount(depositName, requestURL)
                expect(await deposit.getSuccessStatus(response)).toEqual(true)
                expect(await deposit.getInfoCode(response)).toEqual(200)
            })
        })}
    })