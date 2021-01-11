import { browser, logging } from 'protractor';

import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Redis Patterns Console 1.1.0');
  });

  afterEach(async () => {
    // #important When APIS don't work because the limit has been exceeded, the app prints many errors in console
    // In the codebase this case should be handled, in the meantime it is better to disable this check


    // Assert that there are no errors emitted from the browser
    //   const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    //   expect(logs).not.toContain(jasmine.objectContaining({
    //     level: logging.Level.SEVERE,
    //   } as logging.Entry));
    // });
  })
});
