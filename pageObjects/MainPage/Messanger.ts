import { Locator, Page } from "@playwright/test";

export class Messanger{
    page: Page;
    inboxTab: Locator;
    inputMsgField: Locator;

    constructor(page:Page){
        this.page = page
        this.inboxTab = page.locator('[data-group="private"]')
        this.inputMsgField = page.locator('#chat_message_composer_input')
    }
    async openInboxTab(){
        await this.inboxTab.scrollIntoViewIfNeeded()
        await this.inboxTab.click()
    }

    async chooseChat(UserName: string){
        await this.page.waitForSelector('.chat-conversation-list__content',{state:'visible'})
        let chatIcon = await this.page.locator('.chat-conversation-list-item__title', {hasText: UserName})
        await chatIcon.click()
    }

    async sendMessage(message: string){
        await this.inputMsgField.pressSequentially(message)
        await this.page.waitForTimeout(1000)
        await this.page.locator("//i[contains(@class, 'icn-send-message')]").click()
    }
    async getMyLastMsgInChat(smsMsg: string){
        await this.page.waitForTimeout(500)
        let AllMessages = await this.page.locator("//div[contains(@class, 'chat-message')]")
        let msg = await AllMessages.locator("//div[contains(@class, 'bubble bubble')]//div", {hasText: smsMsg})
        return await msg
    }

    async getLastReceivedMsg(){
        await this.page.waitForTimeout(500)
        let chatMsg = await this.page.locator("//div[contains(@class, 'chat-message end')]")
        let msg = await chatMsg.locator("//div[contains(@class, 'bubble bubble')]//div[1]")
        return await msg.textContent()
    }
    async openPopupChatWithUser(userName: string){
        let popup = await this.page.locator("//div[@class='messages-container']").nth(1)
        let userChat = await popup.locator("//div[@class='messages-container__user']", {has: await this.page.locator(`//div[text()='${userName}']`)})
        await userChat.click()
        await this.page.waitForSelector('.chat',{state:'visible'})
    }

    async openMobileChatWithUser(userName: string){
        //let popup = await this.page.locator("//div[@class='messages-container']").nth(1)
        await this.page.waitForSelector(".chat-conversation-list-item__title", {state:'visible'})
        let userChat = await this.page.locator(".chat-conversation-list-item__title", {hasText:userName})
        await userChat.tap()
        await this.page.waitForSelector('.chat',{state:'visible'})
    }
}  