import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { Withdrawal } from "../../pageObjects/ManageFunds/Withdrawal"
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import {test} from "../../test-options"
import { getLocalization } from "../../pageObjects/localization/getText";

test.describe("Naga Capital. Withdrawal", async()=>{
    const ManageFunds_Withdrawal = "/pageObjects/localization/ManageFunds_Withdrawal.json";
    let amountValueToWithrawal = '55'

    test.beforeEach("Login by trade user", async({page, NagaCapital}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 50000);
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page);
        await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
            await sighIn.goto(NagaCapital,'login');
            await sighIn.sigInUserToPlatform("testTrading2", process.env.USER_PASSWORD || '');
            await mainPage.openManageFunds();
            await new Withdrawal(page).chooseWithdrawalMenu();
        });
    })
    
    test("@24097 Withdrawal via credit card", async({page})=>{
        let withdrawal = new Withdrawal(page);
        await test.step('Make withdrawal via credit card', async()=>{
            await withdrawal.clickMenuPoint('Credit Card');
            await withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            expect(await withdrawal.getWithdrawalAmountValue()).toContain(amountValueToWithrawal);
            await withdrawal.clickWithdrawBtn();
        })
        await test.step("Check withdrawal iframe", async()=>{
            expect(await withdrawal.getTitleOfCashierName()).toContain('Credit Card')
            expect(await withdrawal.checkNameOfIframe()).toEqual('_cashier_iframe')
        })
    })
    test("@24932 Withdrawal validation rulls", async({page})=>{
        let withdrawal = new Withdrawal(page);
        let valueToWithrawal = '10'
        await test.step('Input NOT valid amount for withdrawal', async()=>{
            await withdrawal.clickMenuPoint('Credit Card');
            await withdrawal.inputAmountWithdrawal(valueToWithrawal);
            expect(await withdrawal.getErrorText()).toContain("Amount has to be greater than or equal to")
        });
        await test.step("Open modal popup for cc cashier", async()=>{
            await withdrawal.openModalCCPopup();
            expect(await withdrawal.checkModalPopup()).toBeVisible()
        })
    });
    test("@24091 Check Crypto withdrawal", async({page})=>{
        let withdrawal = new Withdrawal(page);
        let localization = new getLocalization(ManageFunds_Withdrawal);
        await test.step("Make crypto withdrawal", async()=>{
            await withdrawal.clickMenuPoint('Crypto')
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

test.describe('Naga Markets. Withdrawal', async()=>{
    let amountValueToWithrawal = '50'

    test.beforeEach("Login by trade user", async({page, NagaMarkets}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 50000);
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page);
        await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
            await sighIn.goto(NagaMarkets,'login');
            await sighIn.sigInUserToPlatform("depositTestMarkets3", process.env.USER_PASSWORD || '');
            await mainPage.openManageFunds();
            await new Withdrawal(page).chooseWithdrawalMenu();
        });
    })

    test('@24093 PayPal withdrawal', async({page})=>{
        let withdrawal = new Withdrawal(page)
        await withdrawal.clickMenuPoint('PayPal')
        await withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
        await withdrawal.clickWithdrawBtn();
        expect(await withdrawal.getNagaMarketsWithdrawalPopupTitle()).toContain(`The withdrawal of €${amountValueToWithrawal} to your PayPal is being reviewed.`)
    })    

    test.skip('@24094 Altbank withdrawal', async({page})=>{
        let withdrawal = new Withdrawal(page)
        await test.step('Make withdrawal of altbank', async()=>{
            await withdrawal.clickMenuPoint('Bank Account')
            await withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            await withdrawal.clickWithdrawBtn();
        await test.step("Check withdrawal iframe", async()=>{
            expect(await withdrawal.getTitleOfCashierName()).toContain('Altbank')
            expect(await withdrawal.checkNameOfIframe()).toEqual('_cashier_iframe')
        })
        })
    })
})

test.describe('Withdrawal with different paymnet methods', async()=>{
type testWithdrawalTypes = {
    testRailId: string,
    brand: string,
    user: string,
    menuPoint: string,
    paymentMethod: string,
    withdrawalPageTitle: string,
    amount: string
}
const testWithdrawalParameters: testWithdrawalTypes[] = [
    {testRailId: '@24098', brand: '@NS', user: 'testWithdrawal@i.ua', menuPoint: 'eWallet', paymentMethod: 'neteller', withdrawalPageTitle: 'Neteller', amount: '50'},
    {testRailId: '@24095', brand: '@NS', user: 'testWithdrawal2@i.ua', menuPoint: 'eWallet', paymentMethod: 'skrill', withdrawalPageTitle: 'Skrill', amount: '50'},
    {testRailId: '@24089', brand: '@NS', user: 'testWithdrawal3@i.ua', menuPoint: 'eWallet', paymentMethod: 'perfectmoney', withdrawalPageTitle:'Perfect Money', amount: '50'}
]
for(const{testRailId, brand, user, menuPoint, paymentMethod,withdrawalPageTitle, amount}of testWithdrawalParameters){
    test(`${testRailId} Check withdrawal different payments ${paymentMethod} ${brand}`, async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 50000);
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page);
        let withdrawal = new Withdrawal(page);
        await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
            await sighIn.goto(await sighIn.chooseBrand(brand),'login');
            await sighIn.sigInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await mainPage.openManageFunds();
            await new Withdrawal(page).chooseWithdrawalMenu();
        });
        await test.step(`Make ${paymentMethod} withdrawal`, async()=>{
            await withdrawal.clickMenuPoint(menuPoint)
            await withdrawal.clickPaymentMethod(paymentMethod)
            await withdrawal.inputAmountWithdrawal(amount);
            expect(await withdrawal.getEwalletWithdrawalAmount()).toContain(amount);
            await withdrawal.clickWithdrawBtn();
        })
        await test.step(`Check ${withdrawalPageTitle} cashier`, async()=>{
            expect(await withdrawal.getTitleOfCashierName()).toContain(`Withdraw via ${withdrawalPageTitle}`)
            expect(await withdrawal.checkNameOfIframe()).toEqual('_cashier_iframe')
        })
    })
}

const testWithdrawalParametersMarkets: testWithdrawalTypes[] = [
    {testRailId: '@25156', brand: '@NM', user: 'depositTestMarkets', menuPoint: 'eWallet', paymentMethod: 'sofort', withdrawalPageTitle: 'Neteller', amount: '50'},
    {testRailId: '@25157', brand: '@NM', user: 'depositTestMarkets1', menuPoint: 'eWallet', paymentMethod: 'giropay', withdrawalPageTitle: 'Skrill', amount: '50'},
    {testRailId: '@25158', brand: '@NM', user: 'depositTestMarkets2', menuPoint: 'eWallet', paymentMethod: 'webmoney', withdrawalPageTitle:'Perfect Money', amount: '60'},
]
for(const{testRailId, brand, user, menuPoint, paymentMethod,withdrawalPageTitle, amount}of testWithdrawalParametersMarkets){
    test(`${testRailId} NagaMarkets.Check withdrawal with different methods ${brand} ${paymentMethod}`, async({page})=>{
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page);
        let withdrawal = new Withdrawal(page);
        //let amountValueToWithrawal = '50'
        await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
            await sighIn.goto(await sighIn.chooseBrand(brand),'login');
            await sighIn.sigInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await mainPage.openManageFunds();
            await new Withdrawal(page).chooseWithdrawalMenu();
        });
        await test.step(`Make ${paymentMethod} withdrawal`, async()=>{
            await withdrawal.clickMenuPoint(menuPoint)
            await withdrawal.clickPaymentMethod(paymentMethod)
            await withdrawal.inputAmountWithdrawal(amount);
            expect(await withdrawal.getEwalletWithdrawalAmount()).toContain(amount);
            await withdrawal.clickWithdrawBtn();
        })
        await test.step(`Check ${withdrawalPageTitle} cashier`, async()=>{
            expect(await withdrawal.getNagaMarketsWithdrawalPopupTitle()).toContain(`The withdrawal of $${amount} to your ${menuPoint} is being reviewed.`)
        })})}})