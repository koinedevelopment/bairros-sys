import { BairrosSysPage } from './app.po';

describe('bairros-sys App', function() {
  let page: BairrosSysPage;

  beforeEach(() => {
    page = new BairrosSysPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
