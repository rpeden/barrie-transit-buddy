import { TransitPage } from './app.po';

describe('transit App', function() {
  let page: TransitPage;

  beforeEach(() => {
    page = new TransitPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
