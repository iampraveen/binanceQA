describe('Assert Market link lead to ETH/BTC homepage ', () => {

    beforeEach(() => {
        //tracking network request for route assertion
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
  
    it('Assert trading chart, limit, market, stop limit input boxes is loaded properly on ETH/BTC page', () => {
        cy.visit('http://www.binance.com')
        cy.contains('Markets').should('be.visible').click()
        //to proceed waiting for loader spin to disappear   
        cy.get('.css-p1jcpo').should('not.exist')   
        cy.get('.chatShowButton').should('be.visible')     
        cy.get('a[href*="/en/trade/ETH_BTC"]').click() 
        // Should be on a new URL which includes '/trade/ETH_BTC'
        cy.url().should('contain', '/trade/ETH_BTC')
        cy.get('.chatShowButton').should('be.visible') 
        // Relevant API status should be successfull
        cy.wait('@currencyList').its('status').should('eq', 200)
        cy.wait('@depth').its('status').should('eq', 200)
        cy.wait('@tradingChart').its('status').should('eq', 200)
        //should render currency in tables
        cy.get('.ReactVirtualized__Grid > .ReactVirtualized__Grid__innerScrollContainer span').then($currencyTables =>{  
            expect($currencyTables).not.to.be.empty         
        })
        //trading chart should be visible
        cy.get('.chartContainer canvas').then($tradingChart => {
            expect($tradingChart).to.be.visible            
            expect($tradingChart).to.be.length(8)
        }) 
        cy.contains('Stop-limit')
        cy.contains('Trade History')
        cy.contains('Recent Market')
    })
})
