describe('Window', () => {
    const amount = 734
    beforeEach(() => {
        cy.server()
        cy.route({
        method: 'GET',
        url: '**/gateway-api/v1/public/chat-language/list',
        }).as('chat')

        cy.route({
        method: 'GET',
        url: '**/exchange-api/v1/public/asset-service/product/currency',
        }).as('currency')

        cy.route({
        method: 'GET',
        url: '**/api/v1/depth?limit=500&symbol=ETHBTC',
        }).as('conversionData')
    })

    function tableNGraphDataLoad(){
        cy.get('.ReactVirtualized__Grid > .ReactVirtualized__Grid__innerScrollContainer span').then($tables =>{  
            expect($tables).not.to.be.empty         //table data shouldn't be empty
        })
        cy.get('.chartContainer canvas').then($graph => {
            expect($graph).to.be.visible            //graph should be visible
            expect($graph).to.be.length(8)
        })
    }
  
    it('Verify pair trading view ', () => {
        cy.visit('http://www.binance.com')
        cy.contains('Markets').should('be.visible').click();   
        cy.get('.css-p1jcpo').should('not.exist')   //loader should not exist
        cy.get('.chatShowButton').should('be.visible')     
        cy.get('a[href*="/en/trade/ETH_BTC"]') .click() 
        cy.url().should('contain', '/trade/ETH_BTC')
        cy.get('.chatShowButton').should('be.visible') 
        tableNGraphDataLoad();  
        cy.contains('Stop-limit')
        cy.contains('Trade History')
        cy.contains('Recent Market')
    })

    it.only('Assert currency conversion formula', () =>{
        cy.visit('https://www.binance.com/en/trade/ETH_BTC');
        cy.get('.css-p1jcpo').should('not.exist')   //loader should not exist
        tableNGraphDataLoad(); 
        cy.get('#FormRow-BUY-quantity').type(amount).should('have.value',amount.toString())
        cy.get('#FormRow-BUY-price').invoke('val').then(($buyPrice) => {
            cy.get('#FormRow-BUY-total').invoke('val').then(($total) => {
                expect($total).to.include(($buyPrice*amount).toString())
            })           
        })
        cy.get('[id=trade-orderForm-a-BUYlogin]').then(()=>{
            cy.get('[id=orderForm-button-exchangelimitBuy]').should('not.exist')
        })
  
  })

    
    it('Verify websocket data', () => {
            cy.visit('https://www.binance.com/en/trade/ETH_BTC')
            tableNGraphDataLoad();
            cy.wait('@chatShowButton')
            cy.wait('@chat')
            cy.wait('@chartContainer')
    })
})
