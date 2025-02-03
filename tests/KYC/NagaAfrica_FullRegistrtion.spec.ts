import { Captcha } from "../../pageObjects/captcha"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup"
import { PersonalDetails } from "../../pageObjects/FullRegistration/NagaAfrica_PersonalDetails"
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGACapital-PersonalInformationPage"
import { PhoneVerification } from "../../pageObjects/FullRegistration/NAGACapital-PhoneVerification"
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage"
import {test} from "../../test-options"

test.describe('Naga Africa', async()=>{
    let email = ''

    test.beforeEach('Create lead user', async({page, NagaAfrica, NagaAfricaCountry})=>{
        let signUp = new SignUp(page)
        let personalInformation = new PersonalInformation(page)
        email = await new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user with ${email}`, async()=>{
            await signUp.goto(NagaAfrica, 'register')
            await new Captcha(page).removeCaptcha()
            await signUp.createCfdUser_All(email, process.env.USER_PASSWORD || '', NagaAfricaCountry)
        })
        await test.step(`Fill personal information`, async()=>{
            await personalInformation.fillPersonalInformation('Verify with SMS')
            await new PhoneVerification(page).insertVerificationCode()
            await new YouAreInNagaMarkets(page).openNagaKyc()
        })
    })

    test(`@25366 KYC - Advance score. User email-${email}`,async({page})=>{
        let personalDetails = new PersonalDetails(page)
        await test.step(`Fill personal details step`, async()=>{
            await personalDetails.fillPersonalDetail()
            await personalDetails.fillAddressResidence()
        })
        await test.step('Scorring popup', async()=>{
            
        })
        console.log(2)
    })
})