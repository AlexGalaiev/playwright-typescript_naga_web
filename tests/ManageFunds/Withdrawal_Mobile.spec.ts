import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { Deposit } from "../../pageObjects/ManageFunds/Deposit";
import { Withdrawal } from "../../pageObjects/ManageFunds/Withdrawal";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { test } from "../../test-options";
import { getLocalization } from "../../pageObjects/localization/getText";


test.describe('Withdrawal Mobile NS', async()=>{
    const ManageFunds_Withdrawal = "/pageObjects/localization/ManageFunds_Withdrawal.json";
    let amountValueToWithrawal = '55'

    test.beforeEach("Login by trade user", async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 50000);
        let signIn = new SignIn(page);
        await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
            await signIn.goto(AppNAGA,'login');
            await signIn.signInUserToPlatform("testTrading2", process.env.USER_PASSWORD || '');
        });
    })
    test("@24932 Mobile Withdrawal validation rulls", 
        {tag:['@withdrawal', '@mobile', '@manageFunds'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}},
        async({page})=>{
            let withdrawal = new Withdrawal(page);
            let valueToWithrawal = '1'
            let mainPage = new MainPage(page)
            await test.step('Open withdrawal menu', async()=>{
                await mainPage.openMobileBackMenuPoint('Withdraw')
                await new Deposit(page).checkActiveMobileManageTab('withdraw')
            })
            await test.step('Input NOT valid amount for withdrawal', async()=>{
                await withdrawal.chooseMobileWithdrawalMethod('Credit Card');
                await withdrawal.inputAmountWithdrawal(valueToWithrawal);
                expect(await withdrawal.getErrorText()).toContain("Amount has to be greater than or equal to")
            });
            await test.step("Open modal popup for cc cashier", async()=>{
                await withdrawal.openModalCCPopup();
                expect(await withdrawal.checkModalPopup()).toBeVisible()
            })
        })
    test("@24091 Mobile. Crypto withdrawal", 
        {tag:['@withdrawal', '@mobile', '@manageFunds'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}},
        async({page})=>{
        let withdrawal = new Withdrawal(page);
        let localization = new getLocalization(ManageFunds_Withdrawal);
        let mainPage = new MainPage(page)
        await test.step('Open withdrawal menu', async()=>{
            await mainPage.openMobileBackMenuPoint('Withdraw')
            await new Deposit(page).checkActiveMobileManageTab('withdraw')
        })
        await test.step("Make crypto withdrawal", async()=>{
            await withdrawal.chooseMobileWithdrawalMethod('Crypto');
            await withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            await withdrawal.clickWithdrawBtn();
        })
        await test.step("Check crypto wallet popup", async()=>{
            expect(await withdrawal.checkCryptoPopup()).toBeVisible()
            expect(await withdrawal.checkCryptoPopupHeaderText()).toEqual('Withdraw to Crypto')
            await withdrawal.performCryptoWithdrawalToTestAccount();
        })
        await test.step('Check crypto withdrawal success popup', async()=>{
            expect(await withdrawal.checkCryptoWithdrawalSuccessPopup()).toBeTruthy()
            expect(await withdrawal.checkCryptoSuccessPopupText()).toEqual(await localization.getLocalizationText("CryptoWithdrawalSuccessPopupText"))
        })
    })
})

test.describe('Withdrawal Mobile NM', async()=>{
    test("@24093 Mobile PayPal withdrawal", 
        {tag:['@withdrawal', '@mobile', '@manageFunds'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}},
        async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 20000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        let withdrawal = new Withdrawal(page)
        let amountValueToWithrawal = 100
        await test.step('Login by depositTestMarkets3 to NagaMarkets and open withdrawal', async()=>{
            await signIn.goto(AppNAGA,'login');
            await signIn.signInUserToPlatform("depositTestMarkets3", process.env.USER_PASSWORD || '');
            await mainPage.openMobileBackMenuPoint('Withdraw')
            await new Deposit(page).checkActiveMobileManageTab('withdraw')
        });
        await test.step('Open Pay pal withdrawal', async()=>{
            await withdrawal.chooseMobileWithdrawalMethod('PayPal')
            let response = await withdrawal.performManualWithdrawal(amountValueToWithrawal, '**/payment/paypal/withdraw')
            expect(await withdrawal.getAPIWithdrawalMSG(response)).toEqual('Command has been processed successfully.')
            expect(await withdrawal.getAPIWithdrawalAmount(response)).toEqual(amountValueToWithrawal)
        })
    })
})

test.describe('Withdrawal Mobile All brands', async()=>{

    type NS_WithdrawalTypes = {
        testRailId: string,
        brand: string,
        user: string,
        menuPoint: string,
        paymentMethod: string,
        responsePaymentMethod: string
    }
    const NS_WithdrawalParams: NS_WithdrawalTypes[] = [
        {testRailId: '@24098', brand: '@Capital', user: 'testWithdrawal@i.ua', menuPoint: 'eWallet', paymentMethod: 'neteller', responsePaymentMethod:'altneteller'},
        {testRailId: '@24095', brand: '@Capital', user: 'testWithdrawal2@i.ua', menuPoint: 'eWallet', paymentMethod: 'skrill', responsePaymentMethod:'skrill'},
    ]

    for(const{testRailId, brand, user, menuPoint, paymentMethod, responsePaymentMethod}of NS_WithdrawalParams){
        test(`${testRailId} Mobile ${brand} EWallet withdrawals. Check ${paymentMethod} withdrawal`, 
            {tag: ["@withdrawal", '@mobile', '@manageFunds'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, 
            async({page,AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 50000);
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page);
            let withdrawal = new Withdrawal(page);
            await test.step(`Login by ${user} to ${brand} platform and open ${paymentMethod} withdrawal`, async()=>{
                await signIn.goto(AppNAGA,'login');
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
                await mainPage.openMobileBackMenuPoint('Withdraw')
                await new Deposit(page).checkActiveMobileManageTab('withdraw')
                await withdrawal.chooseMobileWithdrawalMethod(menuPoint);
                await withdrawal.chooseMobileEWalletMethod(paymentMethod)
            });
            await test.step(`Make ${paymentMethod} withdrawal`, async()=>{
                let amount = await withdrawal.withdrawalCalculation('$', 10)
                let response = await withdrawal.performManualWithdrawal(amount, '**/api/cashier/get-gateway-list-without-details')
                expect(await withdrawal.getApiPaymentMethodKey(response)).toEqual(responsePaymentMethod)
                expect(await withdrawal.getApiStatusCode(response)).toEqual(200)
            })
        })
    }
    type NM_WithdrawalTypes = {
        testRailId: string,
        brand: string,
        user: string,
        menuPoint: string,
        paymentMethod: string,
        withdrawalPageTitle: string
    }
    const NM_WithdrawalParams: NM_WithdrawalTypes[] = [
        {testRailId: '@25156', brand: '@Markets', user: 'depositTestMarkets', menuPoint: 'eWallet', paymentMethod: 'sofort', withdrawalPageTitle: 'Neteller'},
        {testRailId: '@25157', brand: '@Markets', user: 'depositTestMarkets1', menuPoint: 'eWallet', paymentMethod: 'giropay', withdrawalPageTitle: 'Skrill'},
        {testRailId: '@25158', brand: '@Markets', user: 'depositTestMarkets2', menuPoint: 'eWallet', paymentMethod: 'webmoney', withdrawalPageTitle: 'Perfect Money'}
    ]

    for(const{testRailId, brand, user, menuPoint, paymentMethod,withdrawalPageTitle} of NM_WithdrawalParams){
        test(`${testRailId} Mobile ${brand} Ewallet withdrawal. Check ${withdrawalPageTitle} withdrawal`, 
            {tag: ["@withdrawal", '@mobile', '@manageFunds'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, 
            async({page,AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 20000);
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page);
            let withdrawal = new Withdrawal(page);
            await test.step(`Login by ${user} to ${brand} plarform  and open withdrawal`, async()=>{
                await signIn.goto(AppNAGA,'login');
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
                await mainPage.openMobileBackMenuPoint('Withdraw')
                await new Deposit(page).checkActiveMobileManageTab('withdraw');
            });
            await test.step(`Make ${paymentMethod} withdrawal`, async()=>{
                await withdrawal.chooseMobileWithdrawalMethod(menuPoint);
                await withdrawal.chooseMobileEWalletMethod(paymentMethod)
                let amount = await withdrawal.withdrawalCalculation('$', 10)
                let response = await withdrawal.performManualWithdrawal(amount, '**/payment/manual_withdraw')
                expect(await withdrawal.getAPIWithdrawalMSG(response)).toEqual('Command has been processed successfully.')
                expect(await withdrawal.getAPIWithdrawalAmount(response)).toEqual(amount)
                expect(await withdrawal.getNagaMarketsWithdrawalPopupTitle()).toContain(`The withdrawal of $${amount} to your ${menuPoint} is being reviewed.`)
    
            })
        })}
    type withdrawalEcompayType = {
        testRailId: string,
        brand: string,
        user: string,
        currency: string,
    }
    const withdrawalEcompayParams: withdrawalEcompayType[] = [
        {testRailId: '@25399', brand: '@Mena', user: 'testTrading@naga.com', currency:'€'},
        {testRailId: '@25427', brand: '@Africa', user: 'testTradingAfrica@naga.com', currency:'$'}
    ]
    for(const{testRailId, brand, user, currency}of withdrawalEcompayParams){
        test(`${testRailId} Mobile ${brand} Withdrawal. Bank Account. Ecommpay`, 
        {tag:["@withdrawal",'@mobile', '@manageFunds'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}},
        async({page,AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 50000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        let withdrawal = new Withdrawal(page);
        await test.step(`Login to ${brand} by ${user} and open withdrawal`, async()=>{
            await signIn.goto(AppNAGA,'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await mainPage.openMobileBackMenuPoint('Withdraw')
            await new Deposit(page).checkActiveMobileManageTab('withdraw');
        });
        await test.step(`Make Ecommpay withdrawal`, async()=>{
            await withdrawal.chooseMobileWithdrawalMethod('Bank Account');
            let money = await withdrawal.withdrawalCalculation(currency, 10)
            let response = await withdrawal.performManualWithdrawal(money, '**/api/cashier/get-gateway-list-without-details')
            expect(await withdrawal.getApiPaymentMethodKey(response)).toEqual('Credit Card')
            expect(await withdrawal.getApiStatusCode(response)).toEqual(200)
        })
    })
    }
})
 