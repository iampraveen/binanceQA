describe('Window', () => {
    const amount = 734
    const graphData = {
        url: "wss://stream.binance.com/stream?streams=ethbtc@kline_1h"
        };
    const tableData = {
        url: "wss://stream.binance.com/stream?streams=!miniTicker@arr@3000ms/ethbtc@depth.b10/ethbtc@aggTrade.b10"
        };
    beforeEach(() => {
        cy.server()
        cy.route({
        method: 'GET',
        url: '**/api/v1/klines?symbol=ETHBTC&interval=1h',
        }).as('graphContainer')

        cy.route({
        method: 'GET',
        url: '**/exchange-api/v1/public/asset-service/product/currency',
        }).as('currencyList')

        cy.route({
        method: 'GET',
        url: '**/api/v1/depth?limit=500&symbol=ETHBTC',
        }).as('conversionList')
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
  
    it('Verify pair trading view Page', () => {
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

    it('Assert currency conversion formula', () =>{
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

    
    it.only('Verify websocket data', () => {
            cy.visit('https://www.binance.com/en/trade/ETH_BTC')
            tableNGraphDataLoad();
            cy.streamRequest(graphData).then(results => {
            expect(results).not.to.be.empty;
            }) 
            cy.streamRequest(tableData).then(results => {
            expect(results).not.to.be.empty;
            })         
            cy.wait('@currencyList').its('status').should('eq', 200)
            cy.wait('@conversionList').its('status').should('eq', 200)
            cy.wait('@graphContainer').its('status').should('eq', 200)
    })
})
