import { AllSetPopup } from "../../pageObjects/common/allSetPopup(KYC)/allSetPopup";
import { StartKYCPopup } from "../../pageObjects/common/startKYC_Popup/startKYCPage";
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGACapital-PersonalInformationPage";
import { PhoneVerification } from "../../pageObjects/FullRegistration/NAGACapital-PhoneVerification";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { AddAcountForm } from "../../pageObjects/UserProfile/AddTradingAccount";
import { HeaderMenuUserProfile } from "../../pageObjects/UserProfile/HeaderUserProfile";
import {test} from "..//..//test-options";

test.describe("User profile", async()=>{
    test("@23922 Create 2nd live account", async({page, NagaCapital})=>{
        let sighUp = new SignUp(page);
        let mainPage = new MainPage(page);
        let addAccount = new AddAcountForm(page);
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
            await new HeaderMenuUserProfile(page).openAddNewTradingAccount();
            await addAccount.create_USD_LiveAccount();
            console.log(3)

        })
    })
})
