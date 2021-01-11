import { browser, by, element, ElementFinder, Key, WebElement, WebElementPromise } from 'protractor';

export class CommandLineComponent {
    element: ElementFinder
    constructor() {
        this.element = element(by.tagName('tr-command-line'))
    }

    async sendCommand(command: string) {
        const input = this.element.$("input")
        await input.sendKeys(command)
        await input.sendKeys(Key.ENTER)
    }

    upKey() {
        const input = this.element.$("input")
        input.sendKeys(Key.ARROW_UP)
    }

    downKey() {
        const input = this.element.$("input")
        input.sendKeys(Key.ARROW_DOWN)
    }

    getValue() {
        return this.element.$("input").getAttribute('value')
    }
}
