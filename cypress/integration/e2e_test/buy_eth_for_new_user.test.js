describe('Assert Currency conversion for new user ', () => {
    const eth_amount = 734
    beforeEach(() => {
        // tracking network request for route assertion
        cy.server()
        cy.route({
        method: 'GET',
        url: '**/api/v1/klines?symbol=ETHBTC&interval=1h',
        }).as('tradingChart')

        cy.route({
        method: 'GET',
        url: '**/exchange-api/v1/public/asset-service/product/currency',
        }).as('currencyList')

        cy.route({
        method: 'GET',
        url: '**/api/v1/depth?limit=500&symbol=ETHBTC',
        }).as('depth')
    })
  
    it('Verify Buy ETH text box is rendering correct data and landing new user to sign up page while buying', () =>{
        cy.visit('https://www.binance.com/en/trade/ETH_BTC')
        // to proceed waiting for loader spin to disappear
        cy.get('.css-p1jcpo').should('not.exist') 
        // Relevant API status should be successfull
        cy.wait('@currencyList').its('status').should('eq', 200)
        cy.wait('@depth').its('status').should('eq', 200)
        cy.wait('@tradingChart').its('status').should('eq', 200)
        // should reflect entered amount in ETH text box
        cy.get('#FormRow-BUY-quantity').type(eth_amount).should('have.value',eth_amount.toString())
        // should verify total amount = amount*price
        cy.get('#FormRow-BUY-price').invoke('val').then(($buyPrice) => {
            cy.get('#FormRow-BUY-total').invoke('val').then(($total) => {
                expect($total).to.include(($buyPrice*amount).toString())
            }) 
        })
        // Buy ETH should not exist/visible in DOM as user is not logged in
        cy.get('[id=orderForm-button-exchangelimitBuy]').should('not.exist')
        // should click on login button which land on register page
        cy.get('[id=trade-orderForm-a-BUYlogin]').then(()=>{
            cy.contains('Register').should('be.visible')      
        })
        })
})
