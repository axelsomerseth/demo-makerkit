import organizationPageObject from '../../support/organization.po';
import configuration from '~/configuration';

describe(`Create Organization`, () => {
  const organizationName = `New Organization`;

  before(() => {
    cy.signIn(configuration.paths.appHome);
  });

  describe(`Given the user updates the organization name and logo`, () => {
    it('the current selected organization will be the one created', () => {
      organizationPageObject.$currentOrganization().wait(100).click();
      organizationPageObject.$createOrganizationButton().click();

      organizationPageObject
        .$createOrganizationNameInput()
        .type(organizationName);

      organizationPageObject.$confirmCreateOrganizationButton().click();

      organizationPageObject
        .$currentOrganization()
        .should('contain', organizationName);
    });
  });
});
