import { Locator, Page } from "playwright/test";

export class Feed {
  page: Page;
  readonly mainPagePostText: Locator;
  readonly createPostTextArea: Locator;
  readonly postBtn: Locator;
  readonly postTextArea: Locator;
  readonly editPostBtn: Locator;
  readonly deletePostBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainPagePostText = page
      .locator("//div[@class='feed-status-post']")
      .locator("//div[@class='feed-status-post__actions-input']");
    this.createPostTextArea = page.locator("#feed_comment_input_textarea");
    this.postBtn = page.locator("#post_status_button");
    this.postTextArea = page.locator("#feed_comment_input_textarea");
    this.editPostBtn = page.locator("[data-cy='edit-post']");
    this.deletePostBtn = page.locator("//a[text()='Delete this post']");
  }

  async openCreatePostForm() {
    await this.mainPagePostText.waitFor({ state: "visible" });
    await this.mainPagePostText.click();
  }

  async deleteExistedPost(userName: string) {
    await this.mainPagePostText.waitFor({ state: "visible" });
    let post = await this.page.locator(".user-message-header__top", {
      hasText: userName,
    });
    await post.scrollIntoViewIfNeeded()
    await post.locator(".user-message-header__options").click();
    await this.deletePostBtn.click();
    await this.page.waitForTimeout(250)
    await this.page.getByRole("button", { name: "Yes, Delete" }).click();
  }

  async deleteSharedPost(textDescription: string) {
    await this.mainPagePostText.waitFor({ state: "visible" });
    let post = await this.page.locator(".user-message-header", {
      hasText: textDescription,
    });
    await post.locator(".user-message-header__options").click();
    await this.deletePostBtn.first().click();
    await this.page.getByRole("button", { name: "Yes, Delete" }).click();
    await this.page.waitForTimeout(500);
  }

  async closeOpenedPost(userName: string) {
    await this.page.waitForTimeout(5000);
    let existPost = await this.page.locator("[data-cy='options-dropdown-btn']").first()
    while (await existPost.isVisible()){
      await existPost.click();
      let deleteBtn = await this.page.locator("//div[contains(@class, 'open')]//a[@data-cy='delete-post']")
      await deleteBtn.click();
      await this.page.getByRole("button", { name: "Yes, Delete" }).click();
      await this.page.waitForTimeout(3500)
  }}

  async addTextToPost(postText: string) {
    await this.postTextArea.clear();
    await this.postTextArea.pressSequentially(postText);
    await this.page.waitForTimeout(500);
    await this.postBtn.click();
    return postText;
  }
  async addTextToCryptoPost(postText:string){
    let postArea = await this.page.locator("//div[@class='feed-status-post-modal__body']//textarea")
    await postArea.clear()
    await postArea.pressSequentially(postText);
    await this.page.waitForTimeout(500);
    await this.postBtn.click();
    await this.page.waitForTimeout(1500)
    return postText;
  }

  async editExistedPost(userName: string) {
    let post = await this.page.locator(".user-message-header__top", {
      hasText: userName,
    });
    await post.scrollIntoViewIfNeeded()
    await post.locator(".user-message-header__options").click();
    await post.locator('[data-cy="edit-post"]').click();
  }
  async editCryptoExistedPost(userName: string){
    let post = await this.page.locator(".user-message-header__user-info__username", {
      hasText: userName,
    });
    await post.scrollIntoViewIfNeeded()
    await post.locator(".user-message-header__options").click();
    await post.locator('[data-cy="edit-post"]').click();
  }

  async likePost(userName: string) {
    let post = await this.page.locator(".feed-item", { hasText: userName });
    await post.scrollIntoViewIfNeeded()
    await post.locator(".feed-item-like").click();
  }

  async checkLike(userName: string) {
    let post = await this.page.locator(".feed-item", { hasText: userName });
    await post.locator(".feed-item-reactions__likes-field").click();
    let popupLikes = await this.page.locator(".modal-content", {
      hasText: userName,
    });
    let likedPerson = await popupLikes.locator(
      ".feed-likes-modal__item__username"
    );
    return likedPerson.textContent();
  }

  async checkUserPage(userName: string) {
    await this.page.locator(".feed-likes-modal__item__username").click();
  }

  async addCommentToPost(userName: string, commentText: string) {
    let post = await this.page.locator(".feed-item", { hasText: userName });
    await post.locator(".feed-item-comment").click();
    let postPopup = await this.page.locator(".modal-body");
    await postPopup
      .locator("#feed_comment_input_textarea")
      .pressSequentially(commentText);
    await postPopup.locator("//i[contains(@class, 'icn-send')]").click();
    await this.page.waitForTimeout(1000)
    await postPopup.locator("//button[@class='close']").click();
  }
  async checkTextOfPost(userName: string) {
    let post = await this.page.locator(".feed-item", { hasText: userName });
    await post.locator(".feed-item-comment__text").first().click();
    await this.page.waitForTimeout(1500)
    let comment = await this.page.locator(".feed-item-comment-list__item");
    let text = await comment
      .locator(".feed-item-comment-list__item__comment")
      .textContent();
    await this.page.waitForTimeout(500)
    return text;
  }
  async closeTab() {
    await this.page.locator("//button[@class='close']").click();
  }
  async sharedToNagaFeed(userName: string) {
    let post = await this.page.locator(".feed-item", { hasText: userName });
    await post.locator("#feed_item_share").click();
    await post.getByAltText("NAGA").click();
  }
  async addSharedTextToPost(testText: string) {
    await this.page
      .locator("#feed_comment_input_textarea")
      .pressSequentially(testText);
    await this.page.getByRole("button", { name: "Share" }).click();
    await this.page.getByRole("button", { name: "Ok" }).click();
  }
  async clickOnPostZone() {
    await this.createPostTextArea.click();
  }
  async getMessageForNotverifiedUser() {
    return await this.page
      .locator("//div[@class='prompt__content__message']")
      .textContent();
  }
  async checkRedirectToVerification() {
    let verifyBtn = await this.page.getByRole("button", {
      name: "Verify Account",
    });
    await verifyBtn.click();
  }
  async getMainPagePostText(userId: string){
    let post = await this.page.locator("//div[@class='feed-item']", {has: await this.page.locator(`//a[text()='${userId}']`)})
    let text = await post.locator('.user-message-header__description').textContent()
    return text
  }
  async checkFirstPostText(){
    await this.page.locator("//button[text()='Trades']").click()
    await this.page.waitForTimeout(1000)
    let post = await this.page.locator(".feed-item").first()
    let text = await post.locator(".user-message-header__description").first()
    return await text.textContent()
  }
  async checkOpenTradeBtnIsVisible(){
    await this.page.locator("//button[text()='Trades']").click()
    await this.page.waitForTimeout(500)
    let btn = await this.page.locator("//button[text()='Open trade']").first()
    return await btn.isVisible()
  }

  async checkMobileTradeBtnIsVisible(){
    await this.page.waitForTimeout(500)
    let btn = await this.page.locator("//button[text()='Open trade']").first()
    return await btn.isVisible()
  }

}
