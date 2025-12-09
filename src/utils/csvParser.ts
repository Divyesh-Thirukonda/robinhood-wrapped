import type { TradingYear, Stock } from '../data/mockData';

export async function parseCSV(file: File, currentPortfolioValue: number): Promise<TradingYear> {
    const text = await file.text();

    // Custom CSV parser to handle multiline quotes
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = '';
    let insideQuote = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (insideQuote && nextChar === '"') {
                // Escaped quote
                currentField += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                insideQuote = !insideQuote;
            }
        } else if (char === ',' && !insideQuote) {
            // End of field
            currentRow.push(currentField.trim());
            currentField = '';
        } else if ((char === '\n' || char === '\r') && !insideQuote) {
            // End of row
            // Handle CRLF (only push if we have content)
            if (char === '\r' && nextChar === '\n') continue; // Skip CR in CRLF

            currentRow.push(currentField.trim());
            if (currentRow.length > 0 && (currentRow.length > 1 || currentRow[0] !== '')) {
                rows.push(currentRow);
            }
            currentRow = [];
            currentField = '';
        } else {
            currentField += char;
        }
    }
    // Push last row if exists
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
    }

    // Assuming first row is header
    const headers = rows[0];
    const idxTransCode = headers.indexOf('Trans Code');
    const idxAmount = headers.findIndex(h => h === 'Amount' || h === 'Total Cost');
    const idxInstrument = headers.indexOf('Instrument');
    // const idxDescription = headers.indexOf('Description');

    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let totalTrades = 0;
    const stockCounts: Record<string, number> = {};

    // Helper to parse currency: "($1,234.56)" -> -1234.56
    const parseAmount = (str: string): number => {
        if (!str) return 0;
        const clean = str.replace(/[$,]/g, '');
        if (clean.startsWith('(') && clean.endsWith(')')) {
            return -1 * parseFloat(clean.slice(1, -1));
        }
        return parseFloat(clean) || 0;
    };

    for (let i = 1; i < rows.length; i++) {
        const cols = rows[i];
        if (cols.length < headers.length) continue; // Skip malformed rows

        const transCode = idxTransCode > -1 ? cols[idxTransCode] : '';
        const amountStr = idxAmount > -1 ? cols[idxAmount] : '0';
        const amount = parseAmount(amountStr);
        const instrument = idxInstrument > -1 ? cols[idxInstrument] : '';

        // Deposits / Withdrawals
        // ACH, RTP (Real Time Payment/Instant), XENT (Transfer), GDBP (Gold Deposit), INT (Interest - maybe count as deposit/income?)
        if (['ACH', 'RTP', 'XENT', 'GDBP'].includes(transCode)) {
            if (amount > 0) totalDeposits += amount;
            else if (amount < 0) totalWithdrawals += Math.abs(amount);
        }

        // Trades (Buy, Sell, Options)
        // Buy, Sell, BTO (Buy to Open), STC (Sell to Close), STO (Sell to Open), BTC (Buy to Close)
        if (['Buy', 'Sell', 'BTO', 'STC', 'STO', 'BTC', 'OEXP'].includes(transCode)) {
            totalTrades++;

            // Track frequency for Top Stock
            // Only count actual trade actions, not Expirations (OEXP) for "Favorite" maybe?
            if (instrument && transCode !== 'OEXP') {
                stockCounts[instrument] = (stockCounts[instrument] || 0) + 1;
            }
        }
    }

    const sortedStocks = Object.entries(stockCounts).sort((a, b) => b[1] - a[1]);
    const topTicker = sortedStocks.length > 0 ? sortedStocks[0][0] : 'N/A';

    // Calculate Net PnL
    // Formula: Current Value - (Total Deposits - Total Withdrawals)
    // If user made $10k profit, Current Value should be (Deposits + 10k)
    const netPnL = currentPortfolioValue - (totalDeposits - totalWithdrawals);
    const pnlPercentage = totalDeposits > 0 ? (netPnL / totalDeposits) * 100 : 0;

    const topStock: Stock = {
        symbol: topTicker,
        name: topTicker,
        gain: 0,
        value: 0,
        logo: '#00C805'
    };

    let archetype: TradingYear['archetype'] = 'Value Investor';
    if (totalTrades > 1000) archetype = 'Day Trader';
    else if (totalTrades < 20) archetype = 'Diamond Hands';
    else if (totalTrades > 200) archetype = 'FOMO Buyer';

    return {
        totalDeposits,
        totalWithdrawals,
        netPnL,
        pnlPercentage: parseFloat(pnlPercentage.toFixed(2)),
        totalTrades: totalTrades,
        topStock,
        worstStock: topStock,
        archetype
    };
}
