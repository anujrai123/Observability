export class FlipkartPage {

    constructor(page) {
        this.page = page;
        this.searchBox = page.locator('input[name="q"]:not([readonly])');
        this.closeButton = page.locator('span[role="button"]', { name: '✕' });
    }

    async open(url) {
        //await this.page.goto("https://www.flipkart.com",{ waitUntil: "domcontentloaded" })
        await this.page.goto(url)
        await this.page.waitForLoadState('networkidle');
        if (await this.closeButton.isVisible()) {
            await this.closeButton.click();
        }
    }
    

    async searchItem(itemName) {
        await this.searchBox.waitFor({ state: 'visible' });
        await this.searchBox.click();
        await this.searchBox.fill(itemName, { delay: 120 });
        await this.searchBox.press('Enter');
        await this.page.waitForLoadState('networkidle')
    }

    async getTitle(){
        return await this.page.title();
    }

    async filterL2H(){
        let priceFilter = this.page.locator('text=price -- Low to High');
        await priceFilter.click();
    }

    async filterH2L(){
        let priceFilter = this.page.locator('text=price -- High to Low');
        await priceFilter.click();
    }

    async capturingEvent(name)
    {
        const [newPage] = await Promise.all([
            this.page.waitForEvent('popup'),
            this.page.locator(`text=${name}`).first().click()
          ]);         
        await newPage.waitForLoadState();
        return newPage
    }

    async addingCart(productPage)
    {
        const addToCart = productPage.getByText('Add to cart', {exact:true}).first();
        if (await addToCart.isVisible()) {
            await addToCart.click();
        }
    }

}

module.exports = { FlipkartPage };