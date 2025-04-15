describe('Test Ajout/Modifiction/Suppression pour une discipline', () => {
  beforeEach(() => {
    // On charge la page disciplines sans intercepter le GET pour ne pas renvoyer une liste vide
    cy.request('/disciplines').then((response) => {
      cy.document().invoke('open');
      cy.document().invoke('write', response.body);
      cy.document().invoke('close');
      cy.window().then((win) => {
        win.history.pushState({}, '', '/disciplines');
      });
    });
  });

  it('Ajoute une discipline', () => {
    // Cliquer sur le bouton "Ajouter une discipline"
    cy.get('button').contains('Ajouter une discipline').click();
    cy.get('.popup-overlay').should('be.visible');

    // Remplir le formulaire
    cy.get('input[placeholder="Nom de la discipline"]').type('Yoga (cypress test)');
    cy.get('textarea[placeholder="Description de la discipline"]').type('Une discipline zen');

    // Après avoir rempli le formulaire, cliquer sur le bouton de soumission
    cy.get('button[type="submit"]').click();

    cy.wait(3000);

    cy.contains('Yoga (cypress test)').should('be.visible');
    cy.get('.popup-overlay').should('not.exist');

    // Vérifier que la discipline est bien présente dans la liste
    cy.get('.card').contains('Yoga (cypress test)'); 

    // Cliquer sur la carte de la discipline pour ouvrir ses détails
    cy.get('.card').contains('Yoga (cypress test)').click();

    // Vérifier que la page de détails s'ouvre
    cy.contains('Yoga (cypress test)').should('be.visible');
    cy.contains('Une discipline zen').should('be.visible'); // Vérifier que la description est correcte

    cy.wait(1000);

  });

  it('Modifie la discipline précédemment ajoutée', () => {
    cy.wait(1000);

    cy.get('.card').contains('Yoga (cypress test)').click();

    cy.wait(1000);
    // Cliquer sur le bouton "Modifier"
    cy.get('button').contains('Modifier').click();

    cy.wait(1000);
    // Vérifier que le formulaire de modification est affiché
    cy.get('textarea').should('be.visible');

    cy.wait(1000);

    cy.get('input[label="Nom de la discipline"]').clear().type('Yoga (cypress test) modifiée');
    cy.wait(1000);
    cy.get('textarea[label="Description"]').clear().type('Une discipline zen modifiée');
    cy.wait(1000);

    // Soumettre le formulaire de modification
    cy.get('span').contains('save').click();

    cy.wait(1000);
  });

  it ('Supprime la discipline précédemment ajoutée', () => {
    cy.wait(1000);

    cy.get('.card').contains('Yoga (cypress test) modifiée').click();

    cy.wait(1000);

    // Cliquer sur le bouton "Modifier"
    cy.get('button').contains('Modifier').click();
    
    cy.wait(1000);

    // Cliquer sur le bouton "Supprimer"
    cy.get('span').contains('delete').click();

    cy.wait(1000);

    // Confirmer la suppression
    cy.get('button').contains('Oui').click();

    // Vérifier que la discipline n'est plus présente dans la liste
    cy.contains('Yoga').should('not.exist');
  });
});