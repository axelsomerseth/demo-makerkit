import organizationPageObject from '../../support/organization.po';

describe(`Update Organization`, () => {
  const organizationName = `Organization Name ${Math.random()}`;

  before(() => {
    cy.signIn(`/settings/organization`);
  });

  describe(`Given the user updates the organization name and logo`, () => {
    it('the UI will be updated', () => {
      organizationPageObject
        .$getOrganizationNameInput()
        .clear()
        .type(organizationName);
      organizationPageObject.$getUpdateOrganizationSubmitButton().click();

      organizationPageObject
        .$currentOrganization()
        .should('contain', organizationName);
    });
  });
});
