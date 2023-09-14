/// <reference types="cypress" />
const faker = require('faker-br')
describe('Cadastro de usuários', () => {
    it('Deve efetuar cadastro inserindo CNH com método de entrega Moto', () => {

        //FakerCadastro
        let fakerNomeCompleto = `${faker.name.firstName()} ${faker.name.lastName()}`
        console.log('FakerName: ' + fakerNomeCompleto)
        let fakerEmail = faker.internet.email()
        let fakerCpf = faker.br.cpf()
        const dddsValido = ['11', '21', '31', '41', '48', '61']
        const dddEstado = faker.random.arrayElement(dddsValido)
        const numeroTelefone = faker.random.number({ min: 10000000, max: 99999999 })
        const fakerTelefone = `(${dddEstado})9${numeroTelefone}`

        //FakerEndereço
        const fakerCep = faker.address.zipCodeValidByState()
        const fakerNumero = faker.address.streetAddress().match(/\d+/g).join('')
        const fakerComplemento = `Apto: ${faker.random.number({ min: 1, max: 300 })} Bloco:${faker.random.number({ min: 1, max: 3 })}`

        //Acessa Publicação Buger-eats e valida que estamos na home
        cy.visit('https://buger-eats.vercel.app/')
        cy.get('main > h1').should('be.visible').and('have.text', 'Seja um parceiro entregador pela Buger Eats')

        //Acessa a tela de cadastro
        cy.get('strong').should('be.visible').and('have.text', 'Cadastre-se para fazer entregas').click()
        cy.get('form > h1').should('be.visible').and('contain.text', 'Cadastre-se para')

        //Preenche os dados do usuario
        cy.get('input[placeholder="Nome completo"]').should('be.visible').type(fakerNomeCompleto)
        cy.get('input[placeholder="CPF somente números"]').should('be.visible').type(fakerCpf)
        cy.get('input[name="email"]').should('be.visible').type(fakerEmail)
        cy.get('input[placeholder="Whatsapp"]').should('be.visible').type(fakerTelefone)

        //Preenche o endereço
        cy.get('input[placeholder="CEP"]').should('be.visible').type('08673000')
        cy.get('input[type="button"]').should('be.visible').click()
        cy.get('input[placeholder="Número"]').should('be.visible').type(fakerNumero)
        cy.get('input[name="address-details"]').should('be.visible').type(fakerComplemento)

        //Selecionar método de entrega
        cy.get('li > span').eq(0).should('be.visible').and('have.text', 'Moto').click()
        cy.get('li[class="selected"').eq(0).should('be.visible')

        //Upload imagem CNH
        cy.get('.dropzone > p').should('be.visible').and('have.text', 'Foto da sua CNH')
        cy.get('input[type="file"]').invoke('show').selectFile('cypress/support/imagem/cnh.png').then(($input) => {
            console.log($input)
            const files = $input[0].files
            expect(files[0].name).to.eq('cnh.png')
            cy.get('.button-success').should('be.visible').and('have.text', 'Cadastre-se para fazer entregas').click()
        })

        //Asserção
        cy.get('#swal2-title').should('be.visible').and('have.text', 'Aí Sim...')
        cy.get('button[class="swal2-confirm swal2-styled"]').should('be.visible').click()
        cy.get('main > h1').should('be.visible').and('have.text', 'Seja um parceiro entregador pela Buger Eats')

    });
});
