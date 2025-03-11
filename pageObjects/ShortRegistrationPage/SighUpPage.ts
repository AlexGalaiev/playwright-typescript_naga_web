import { Locator, Page } from "@playwright/test";
import { RandomUser } from "../common/testUserCredentials/randomUser";
import {faker, fakerEN} from '@faker-js/faker'

export class SignUp{
    page: Page;
    readonly email: Locator;
    readonly password: Locator;
    readonly country: Locator;
    readonly submitBtn: Locator;
    readonly riskWarning: Locator;
    readonly sighUpTittle: Locator;
    readonly checkbox_PrivacyPolicy: Locator;
    readonly checkbox_RiskAcceptance: Locator;
    readonly NX_RiskDisclaimer: Locator;
    readonly phone: Locator;
    notCorrectCountryMSG: Locator;
    countryCrypto: Locator;
    phoneCode: Locator;
    riskWarningMena:Locator;

    constructor(page: Page){
        this.page = page;
        this.email = page.locator("[name='email']");
        this.password = page.locator("[name='password']");
        this.country = page.locator('//label[text()="Country"]//..//div[@data-testid="naga-dropdown-input"]');
        this.phoneCode = page.locator("//label[text()='Country Code']//..//div[@data-testid='naga-dropdown-input']")
        this.phone = page.locator('//input[@name="phone"]')
        this.countryCrypto = page.locator("//div[contains(@class, 'dropdown-select__custom__control')]")
        this.submitBtn = page.locator("//button[contains(@class, 'submit')]");
        this.riskWarning = page.locator("//div[contains(@class, 'registration-form__risk-warning')]");
        this.riskWarningMena = page.locator(".registration-form__terms-and-conditions")
        this.sighUpTittle = page.locator("//div[@class='registration-form__title']")
        this.checkbox_PrivacyPolicy = page.locator("//input[@data-testid='privacy-policy-checkbox']/following-sibling::label");
        this.checkbox_RiskAcceptance = page.locator("//input[@data-testid='data-processing-checkbox']/following-sibling::label");
        this.NX_RiskDisclaimer = page.locator("//label[contains(@class, 'registration-form__consent')]");
        this.notCorrectCountryMSG = page.locator("//div[contains(@class, 'registration-form__country-error--shown')]")
    };

    async goto(MainPage: string, pageTest: string){
        await this.page.goto(`${MainPage}/${pageTest}`);
    };

    async createCFDUser(email: string, password: string,  country: string, countryCode: string, phone: string ){
        await this.page.waitForTimeout(500)
        await this.email.pressSequentially(email);
        await this.password.pressSequentially(password)
        await this.checkCountry(country)
        await this.checkPhoneCode(countryCode)
        await this.phone.pressSequentially(phone)
        await this.page.waitForTimeout(750)
        await this.page.locator("//button[text()='Sign Up']").click()
    };
    async createCfdUser_All(email: string, password: string,  country: string, countryCode: string, phoneNumber: string){
        await this.page.waitForLoadState()
        await this.email.pressSequentially(email);
        await this.password.pressSequentially(password)
        await this.checkCountry(country)
        await this.checkPhoneCode(countryCode)
        await this.phone.pressSequentially(phoneNumber)
        await this.checkbox_PrivacyPolicy.click();
        await this.checkbox_RiskAcceptance.click();
        await this.submitBtn.click();
    }

    async createCryptoUser(email: string, password: string, country: string){
        await this.page.waitForSelector("//div[contains(@class, 'registration-form__subtitle')]", {state:'visible'})
        await this.email.pressSequentially(email);
        await this.password.pressSequentially(password)
        await this.checkCountry_Crypto(country)
        await this.page.locator("//label[contains(@class, 'registration-form__consent-checkbox')]").click()
        await this.submitBtn.click()
        await this.page.waitForSelector('.complete-your-profile-modal__panel', {state:'visible'})
    }

    async checkCountry(Country: string){
        if(await this.country.textContent() !== Country){
            await this.country.click();
            await this.country.pressSequentially(Country);
            await this.country.press('Enter')
        } else {}
    };
    async checkPhoneCode(code: string){
        if(await this.phoneCode.textContent() !== code){
            await this.phoneCode.click();
            //await this.phoneCode.clear()
            await this.phoneCode.pressSequentially(code);
            await this.phoneCode.press('Enter')
        } else {}
    }

    async checkCountry_Crypto(country: string){
        await this.countryCrypto.click();
        await this.countryCrypto.pressSequentially(country);
        await this.page.waitForTimeout(500)
        await this.countryCrypto.press('Enter')
    }
    async getRiskWarningText(){
        return await this.riskWarning.textContent();
    };
    async getRiskWarningText_NX(){
        return await this.NX_RiskDisclaimer.textContent()
    }
    async getSighUpTittleText(){
        return await this.sighUpTittle.textContent();
    };

    async getNotCoorectMsgText(){
        await this.page.waitForTimeout(500)
        return await this.notCorrectCountryMSG.textContent()
    }
    async inputCountry(country: string){
        await this.country.click();
        await this.country.pressSequentially(country);
        await this.country.press('Enter')
        await this.page.waitForTimeout(1000)
    }

    async openDocument(documentName: string):Promise<Page>{
        let doc = await this.page.locator(`//a[text()='${documentName}']`).first()
        await doc.scrollIntoViewIfNeeded();
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            doc.click()
        ])
        await this.page.waitForTimeout(2000)
        return newPage
    }
    async checkUrl(){
        await this.page.waitForTimeout(3000)
        return await this.page.url()
    }
    async switchBack(){
        await this.page.bringToFront()
        await this.page.waitForTimeout(750)
    }
    async closeTab(){
        await this.page.close()
    }

    async getNumberObBtns(){
        return await this.page.locator("//button[contains(@class, 'button')]").count()
    }
    async personalInfoPopup(){
        let personalInfoPopup = await this.page.locator("//span[text()='Welcome to NAGA!']")
        await personalInfoPopup.waitFor({state:'visible'})
        return await personalInfoPopup
    }
    async getDocumentHref(documentName: string){
        let document = await this.page.locator(`//a[text()='${documentName}']`).first()
        return await document.getAttribute('href')
    }
    async getMenaRiskWarning(){
        return await this.riskWarningMena.textContent()
    }
}

