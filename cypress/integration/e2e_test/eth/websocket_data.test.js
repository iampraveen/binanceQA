describe('Assert websocket data is consistent', () => {
    // defind websocket ur  which is responsible for data to be render in chart and tables respectively
    const chartData = {
        url: "wss://stream.binance.com/stream?streams=ethbtc@kline_1h"
        };
    const tableData = {
        url: "wss://stream.binance.com/stream?streams=!miniTicker@arr@3000ms/ethbtc@depth.b10/ethbtc@aggTrade.b10"
        };

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

        cy.visit('https://www.binance.com/en/trade/ETH_BTC')
    })

    function assertSocketStream(content){
        cy.streamRequest(content).then(results => {
        expect(results).not.to.be.empty;
        }) 
    }

    it('Verify data is loaded properly and there is consistent stream of data', () => {
        //1. Verify data is loaded properly

        // Relevant API status should be successfull
        cy.wait('@currencyList').its('status').should('eq', 200)
        cy.wait('@depth').its('status').should('eq', 200)
        cy.wait('@tradingChart').its('status').should('eq', 200)

        // chat button should be visible
        cy.get('.chatShowButton').should('be.visible') 
        //should render currency in tables
        cy.get('.ReactVirtualized__Grid > .ReactVirtualized__Grid__innerScrollContainer span').then($currencyTables =>{  
            expect($currencyTables).not.to.be.empty         
        })
        //trading chart should be visible
        cy.get('.chartContainer canvas').then($tradingChart => {
            expect($tradingChart).to.be.visible            
            expect($tradingChart).to.be.length(8)
        }) 

        // 2. Verify there is consistent stream of data through websocket 
        assertSocketStream(chartData);
        assertSocketStream(tableData); 
    }) 
})
