import { Locator, Page } from "playwright/test";

export class HelpPage{
    page: Page;
    readonly faq: Locator;
    readonly chat: Locator;
    readonly callUs: Locator;
    readonly submitTicket: Locator;
    readonly subPageTittle: Locator;
    readonly phone: Locator;
    readonly email: Locator;
    readonly openedChat: Locator;

    constructor(page: Page){
        this.page = page
        this.faq = page.locator("#sm_faq")
        this.chat = page.locator("#sm_chat_whith_us")
        this.callUs = page.locator("#sm_call_us")
        this.submitTicket = page.locator("#sm_submit_ticket")
        this.subPageTittle = page.locator(".news-item-details__content__title")
        this.phone = page.locator("//a[contains(@class, 'phone__value')]")
        this.email = page.locator("//p[text()='Email']/following-sibling::*")
        this.openedChat = page.locator("//iframe[@name='Messaging window']")
    };
    async openFAQPage(nameOfPage: string){
        let faqPage = await this.page.locator(`//h2[text()=${nameOfPage}]//..`)
        await faqPage.click()
    };
    async openCallUsPage(){
        await this.callUs.click()
    };
    async openChatWithUs(){
        await this.chat.click();
    }
    async openSupBlogPage(nameOfTheSubPage: string){
        let subPage = await this.page.locator(`//h2[contains(text(), ${nameOfTheSubPage})]//..`);
        await subPage.click()
    };
    async getSubPageTitle(){
        return await this.subPageTittle.textContent();
    };
    async openChat(){
        await this.chat.click()
    };
    async getPhoneValue(){
        return await this.phone.textContent()
    };
    async getEmailValue(){
        return await this.email.textContent()
    };
    async checkOpenedChat(){
        return await this.openedChat
    };
    async getNMContactInfo(contactName: string){
        let fieldInfo = await this.page.locator('.call-us__global-info__row', {hasText: contactName})
        let value = await fieldInfo.locator('.call-us__global-info__row__value').textContent()
        return await value
    }
       
}