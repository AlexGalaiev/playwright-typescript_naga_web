import { Locator, Page } from "@playwright/test";
import { RandomUser } from "../common/testUserCredentials/randomUser";
import {faker, fakerEN} from '@faker-js/faker'

export class SighUp{
    page: Page;
    readonly email: Locator;
    readonly password: Locator;
    readonly country: Locator;
    readonly submitBtn: Locator;
    readonly riskWarning: Locator;
    readonly sighUpTittle: Locator;
    readonly NM_checkboxPrivacyPolicy: Locator;
    readonly NM_checkbox_yearsConfirmeation: Locator;

    constructor(page: Page){
        this.page = page;
        this.email = page.locator("[name='email']");
        this.password = page.locator("[name='password']");
        this.country = page.locator("[data-testid='naga-dropdown-input']");
        this.submitBtn = page.locator("//button[contains(@class, 'submit')]");
        this.riskWarning = page.locator("//div[contains(@class, 'registration-form__risk-warning')]");
        this.sighUpTittle = page.locator("//div[@class='registration-form__title']")
        this.NM_checkboxPrivacyPolicy = page.locator("//div[@class='custom-checkbox'][1]");
        this.NM_checkbox_yearsConfirmeation = page.locator("//div[@class='custom-checkbox'][2]");
    };

    async goto(MainPage: string, pageTest: string){
        await this.page.goto(`${MainPage}/${pageTest}`);
    };

    async createCFDUser(Country: string){
        let user = new RandomUser();
        let randomEmail = user.getRandomUserEmail();
        await this.email.pressSequentially(randomEmail);
        await this.password.pressSequentially("Test123!")
        await this.checkCountry(Country)
        await this.submitBtn.click();
        await this.page.waitForSelector('.header__menu',{state:'visible'})
        return randomEmail;
    };
    async create_NM_CFDUser(Country: string){
        let user = new RandomUser();
        let randomEmail = user.getRandomUserEmail();
        await this.email.pressSequentially(randomEmail);
        await this.password.pressSequentially("Test123!")
        await this.checkCountry(Country)
        await this.NM_checkboxPrivacyPolicy.click();
        await this.NM_checkbox_yearsConfirmeation.click();
        await this.submitBtn.click();
        await this.page.waitForSelector('.header__menu',{state:'visible'})
        return randomEmail;
    }

    async checkCountry(Country: string){
        if(await this.country.textContent() !== Country){
            await this.country.click();
            await this.country.pressSequentially(Country);
            await this.country.press('Enter')
        } else {}
    };
    async getRiskWarningText(){
        return await this.riskWarning.textContent();
    };
    async getSighUpTittleText(){
        return await this.sighUpTittle.textContent();
    };
    async addUserApi(email: string, country: string, userName: string){
        let firstName = await fakerEN.person.firstName()
        let lastName = await fakerEN.person.lastName()
        const axios = require('axios');
        let data = JSON.stringify({
        "p_email": email,
        "p_user_name": userName,
        "p_plain_password": "Test123!",
        "p_tel": "+387603039647",
        "is_flexible": true,
        "p_app_language": "en",
        "p_country": country,
        "p_first_name":firstName,
        "p_last_name": lastName,
        "site": {
            "type": "FACEBOOK"
        }
        });
        
        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api-v2.naga.com/user/registration/register',
        headers: {
            'accept-version': '2.*',
            'platform': 'web-trader',
            'Content-Type': 'application/json',
        },
        data : data
        };
        
        axios.request(config)
        .then((response) => {
        //console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
        console.log(error);
        });
    }

    async addUserApiNagaCapital(email: string, country: string){
        const axios = require('axios');
        let data = JSON.stringify({
        "p_app_language":"en",
        "p_user_name": null,
        "p_email": email,
        "p_plain_password": "Test123!",
        // "p_tel": "+387603039647",
        // 'phone_number_confirmed': true,
        "is_flexible": true,
        "p_country": country,
        "p_first_name":"",
        "p_last_name": "",
        "legal_documents_accepted_code":"ns_legal_docs_accepted",
        "personal_data_processing_and_communication_accepted":true,
        "us_citizen_or_resident":false,
        "p_webinar":"web-trader",
        "p_department":"ns",
        "site": {
            "type": "FACEBOOK"
        }
        });
        
        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        //url: 'https://api-v2.naga.com/user/registration/register',
        url: 'https://api-v2-canary.sxdev.io/user/registration/register',
        headers: {
            'accept-version': '2.*',
            'platform': 'web-trader',
            'Content-Type': 'application/json',
        },
        data : data
        };
        
        axios.request(config)
        .then((response) => {
        console.log('response data before phone', JSON.stringify(response.data));
        })
        .catch((error) => {
        console.log(error);
        });
    }

    public randomUserName(){
        const randomNumber = Math.floor(Math.random() * (999 - 10 + 1)) + 10;
        let userName = `user${randomNumber}`
        return userName;
    }
    async createLeadUserApi(country: string){
        let randomEmail = new RandomUser().getRandomUserEmail(); 
        await this.addUserApi(randomEmail, country, this.randomUserName())
        return randomEmail
    }

    async createLeadUserApiNagaCapital(country: string, page: Page){
        let randomEmail = new RandomUser().getRandomUserEmail(); 
        await this.addUserApiNagaCapital(randomEmail, country)
        return randomEmail
    }

    async makePhoneVerifed(page){
    await page.route('*/**/user/info', async route => {
        const response = await route.fetch();
        let body = await response.json();
        console.log(body)
        body.data.company_id = '1';
        body.data.phone_number_confirmed = 'Y'
        body.data.phone_number = "+387603039647";
        body.data.kyc_beginner_risk_accepted = true;
        await route.fulfill({
            response,
            body: JSON.stringify(body),
            headers: {
            ...response.headers(),
            },
        });
        });}

    async checkUserInfo(page){
        await page.route('*/**/user/info', async route => {
            const response = await route.fetch();
            let body = await response.json();
            console.log('body after changing', body)
            console.log('end')
        })
    }
}
