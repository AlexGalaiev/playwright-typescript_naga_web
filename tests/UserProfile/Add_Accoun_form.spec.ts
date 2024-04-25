
import { expect } from "@playwright/test";
import { AllSetPopup } from "../../pageObjects/common/allSetPopup(KYC)/allSetPopup";
import { StartKYCPopup } from "../../pageObjects/common/startKYC_Popup/startKYCPage";
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGACapital-PersonalInformationPage";
import { PhoneVerification } from "../../pageObjects/FullRegistration/NAGACapital-PhoneVerification";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { AddAcountForm } from "../../pageObjects/UserProfile/AddTradingAccount";
import { HeaderMenuUserProfile } from "../../pageObjects/UserProfile/HeaderUserProfile";
import {test} from "..//..//test-options";

import { SighIn } from "../../pageObjects/SighIn/SignInPage";

test.describe("User profile", async()=>{
    
  test("@23922 Create 2nd live account", async({page, NagaCapital})=>{
        let sighUp = new SignUp(page);
        let mainPage = new MainPage(page);
        let addAccount = new AddAcountForm(page);
        let headerMenu = new HeaderMenuUserProfile(page);
        await test.step('Create account with filled personal information', async ()=>{
            await sighUp.goto(NagaCapital, 'register');
            await sighUp.createCFDUser("Ukraine");
            // await mainPage.mainPageIsDownLoaded();
        await test.step('Create account with filled personal information', async ()=>{
            await sighUp.goto(NagaCapital, 'register');
            await sighUp.createCFDUser("Ukraine");
            await mainPage.mainPageIsDownLoaded();
            await mainPage.proceedRegistration();
            await new StartKYCPopup(page).startKYC();
            let phoneVerification = new PhoneVerification(page);
            await phoneVerification.insertTestPhoneNumber();
            await phoneVerification.insertVerificationCode();
            await new PersonalInformation(page).fillPersonalInformation();
            await new AllSetPopup(page).clickDepositNow();
        });
        await test.step('Add second live account', async()=>{
            await headerMenu.openAddNewTradingAccount();
            await addAccount.create_USD_LiveAccount();
            expect(await addAccount.checkNewLiveAccount()).toBeTruthy
        })
        await test.step('Add second demo account', async()=>{
            await headerMenu.openAddNewTradingAccount();
            await addAccount.create_EUR_DemoAccount();
            expect(await addAccount.checkNewDemoAccount()).toBeTruthy
        })
        })

    test("@23930 Edit trading accounts", async({page, NagaCapital})=>{
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page);
        let addAccountForm = new AddAcountForm(page);
        await test.step("Login to platform", async()=>{
            await sighIn.goto(NagaCapital,'login');
            await sighIn.sigInUserToPlatform("userWithAccounts@i.ua", process.env.USER_PASSWORD || '');
        })
        await test.step('Check possibility to change account name', async()=>{
            await new HeaderMenuUserProfile(page).openAddNewTradingAccount();
            await addAccountForm.editAccountName('Default_Live_account')
            await addAccountForm.getDefaultAccountName() === 'Default_Live_account'
            await addAccountForm.editAccountName('NAGA - USD');
        })
        await test.step('Check possibility to show password', async()=>{
            await addAccountForm.openShowPasswordPopup();
            expect(await addAccountForm.checkPasswordContainerIsVisibel()).toBeTruthy()
        })
    })
    })
            await new HeaderMenuUserProfile(page).openAddNewTradingAccount();
            await addAccount.create_USD_LiveAccount();
            console.log(3)

        })
    })
})
