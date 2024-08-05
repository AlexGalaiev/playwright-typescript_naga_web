import { expect } from "@playwright/test";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SighUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { HeaderMenuUserProfile } from "../../pageObjects/UserProfile/HeaderUserProfile";
import { UserProfile } from "../../pageObjects/UserProfile/UserProfile";
import {test} from "..//..//test-options";

test.describe("NagaCapital - User profile", async()=>{
    test("@23573 User profile. General", async({page, NagaCapital})=>{
        let sighUp = new SighUp(page);
        let mainPage = new MainPage(page);
        let userProfile = new UserProfile(page);
        let headerMenu = new HeaderMenuUserProfile(page);
        let randomUser = new RandomUser();
        await test.step('Create lead user', async ()=>{
            await sighUp.goto(NagaCapital, 'register');
            await sighUp.createCFDUser("Ukraine");
            await mainPage.mainPageIsDownLoaded();
        })
        await test.step('Edit username information', async()=>{
            await headerMenu.openProfileMenuPoint();
            let nameBeforeChanging = await userProfile.getUserNameText();
            await userProfile.changeName(randomUser.randomUserName())
            expect(await userProfile.getUserNameText()).not.toEqual(nameBeforeChanging);
        })
        await test.step("Update about me section", async()=>{
            let defaultText = await userProfile.getDefaultText();
            await userProfile.changeAboutMeText();
            expect(await userProfile.getEditedAboutMe()).not.toEqual(defaultText);
        })
    })
})