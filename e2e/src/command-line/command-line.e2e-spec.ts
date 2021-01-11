import { browser, logging } from 'protractor';

import { AppPage } from '../app.po';
import { CommandLineComponent } from './command-line.po';

const command = "set test test"
const command1 = "set test1 test1"
const command2 = "set test2 test2"
const commands = [command, command1, command2]

describe('Command line', () => {
    let page: AppPage;
    let commandLine: CommandLineComponent

    beforeEach(() => {
        page = new AppPage();
        commandLine = new CommandLineComponent()
    });

    afterEach(() => {
        browser.executeScript('window.localStorage.clear();');
    })

    it('should check that history is correct [1]', async () => {
        await page.navigateTo()


        commands.forEach((val) => commandLine.sendCommand(val))
        commandLine.upKey()
        commandLine.upKey()

        const value = await commandLine.getValue()
        return expect(value).toEqual(command1)

    });

    it('should check that history is correct [2]', async () => {
        await page.navigateTo()


        commands.forEach((val) => commandLine.sendCommand(val))
        commandLine.upKey()
        commandLine.downKey()

        const value = await commandLine.getValue()
        return expect(value).toEqual(command2)
    });

    it('should check that history is correct [3]', async () => {
        await page.navigateTo()

        const array = new Array(50)

        commands.forEach((val) => commandLine.sendCommand(val))
        array.forEach(() => commandLine.downKey())


        const value = await commandLine.getValue()
        return expect(value).toEqual("")
    });
})
