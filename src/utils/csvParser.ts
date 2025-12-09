import type { TradingYear, Stock } from '../data/mockData';

export async function parseCSV(file: File, currentPortfolioValue: number): Promise<TradingYear> {
    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

    // Robinhood CSV Headers usually include: "Activity Date", "Process Date", "Settle Date", "Instrument", "Description", "Trans Code", "Quantity", "Price", "Amount"
    // const idxDate = headers.indexOf('Activity Date');
    const idxTransCode = headers.indexOf('Trans Code');
    const idxAmount = headers.findIndex(h => h === 'Amount' || h === 'Total Cost');
    const idxInstrument = headers.indexOf('Instrument'); // Ticker usually here or in Description
    const idxDescription = headers.indexOf('Description');

    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let totalTrades = 0;
    const stockBuys: Record<string, number> = {};

    // Parse lines avoiding the header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        // Handle CSV quoting for splitting
        const cols = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');

        // Clean up cols
        const cleanCols = cols.map(c => c.replace(/"/g, '').trim());

        const transCode = idxTransCode > -1 ? cleanCols[idxTransCode] : '';
        const amountStr = idxAmount > -1 ? cleanCols[idxAmount].replace('$', '').replace(',', '') : '0';
        const amount = parseFloat(amountStr) || 0;

        // Deposits (ACH)
        if (transCode === 'ACH') {
            if (amount > 0) totalDeposits += amount;
            else totalWithdrawals += Math.abs(amount);
        }

        // Trades
        if (transCode === 'Buy' || transCode === 'Sell') {
            totalTrades++;
        }

        // Track Buys for "Top Stock" (using frequency or volume)
        if (transCode === 'Buy') {
            const instrument = idxInstrument > -1 ? cleanCols[idxInstrument] : 'Unknown';
            // Sometimes Instrument is empty/null, might need parsing Description
            let ticker = instrument;
            if (!ticker && idxDescription > -1) {
                // Description often like "Bought 1 share of AAPL..."
                const desc = cleanCols[idxDescription];
                const match = desc.match(/Buy|Bought.*?of\s+([A-Z]+)/i);
                if (match) ticker = match[1];
            }

            if (ticker) {
                stockBuys[ticker] = (stockBuys[ticker] || 0) + 1;
            }
        }
    }

    const sortedStocks = Object.entries(stockBuys).sort((a, b) => b[1] - a[1]);
    const topTicker = sortedStocks.length > 0 ? sortedStocks[0][0] : 'N/A';

    // Calculate generic PnL based on input value
    const netPnL = currentPortfolioValue - (totalDeposits - totalWithdrawals);
    const pnlPercentage = totalDeposits > 0 ? (netPnL / totalDeposits) * 100 : 0;

    // If we have no stocks, just fall back
    const topStock: Stock = {
        symbol: topTicker,
        name: topTicker, // We don't have a name map, just use ticker
        gain: 0, // Cannot calculate per-stock gain easily from simple CSV without current price
        value: 0,
        logo: '#00C805' // Generic
    };

    // Determine archetype based on trade count
    let archetype: TradingYear['archetype'] = 'Value Investor';
    if (totalTrades > 500) archetype = 'Day Trader';
    else if (totalTrades < 10) archetype = 'Diamond Hands';
    else if (totalTrades > 100) archetype = 'FOMO Buyer';

    return {
        totalDeposits,
        totalWithdrawals,
        netPnL,
        pnlPercentage: parseFloat(pnlPercentage.toFixed(2)),
        totalTrades: totalTrades,
        topStock,
        worstStock: topStock, // Placeholder
        archetype
    };
}
