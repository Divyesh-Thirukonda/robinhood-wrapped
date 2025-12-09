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

    // Identify headers
    const headers = rows[0];
    const idxTransCode = headers.indexOf('Trans Code');
    const idxAmount = headers.findIndex(h => h === 'Amount' || h === 'Total Cost');
    const idxInstrument = headers.indexOf('Instrument');

    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let totalTrades = 0;
    const stockCounts: Record<string, number> = {};

    // Helper to parse currency: "($1,234.56)" -> -1234.56
    const parseAmount = (str: string): number => {
        if (!str) return 0;
        // Remove $ and ,
        const clean = str.replace(/[$,]/g, '');
        // Handle parenthesis for negative
        if (clean.startsWith('(') && clean.endsWith(')')) {
            return -1 * parseFloat(clean.slice(1, -1));
        }
        return parseFloat(clean) || 0;
    };

    for (let i = 1; i < rows.length; i++) {
        const cols = rows[i];
        if (cols.length < headers.length) continue;

        // Safe access
        const transCode = idxTransCode > -1 ? cols[idxTransCode] : '';
        const amountStr = idxAmount > -1 ? cols[idxAmount] : '0';
        const amount = parseAmount(amountStr);
        const instrument = idxInstrument > -1 ? cols[idxInstrument] : '';

        // --- Categorization Logic ---

        // 1. Net Deposits (External Flow)
        // ACH: Standard bank deposit
        // RTP: Real Time Payment (Instant Transfer)
        // XENT: Internal/External Transfer (Spending <-> Brokerage)
        // WIRE: Wire Transfer
        if (['ACH', 'RTP', 'XENT', 'WIRE'].includes(transCode)) {
            if (amount > 0) totalDeposits += amount;
            else if (amount < 0) totalWithdrawals += Math.abs(amount);
        }

        // 2. PnL / Activity (Internal Flow - Ignored for Deposits, but counted for Trades/Ops)
        // GDBP: Gold Deposit Boost Payment (Income -> PnL)
        // INT: Interest (Income -> PnL)
        // CDIV: Cash Dividend (Income -> PnL)
        // SLIP: Stock Lending Income (Income -> PnL)
        // GOLD: Gold Fee (Expense -> PnL)

        // 3. Trade Counting
        if (['Buy', 'Sell', 'BTO', 'STC', 'STO', 'BTC', 'OEXP'].includes(transCode)) {
            totalTrades++;

            // Track for Top Stock (exclude Expirations for cleaner list)
            if (instrument && transCode !== 'OEXP') {
                stockCounts[instrument] = (stockCounts[instrument] || 0) + 1;
            }
        }
    }

    const sortedStocks = Object.entries(stockCounts).sort((a, b) => b[1] - a[1]);
    const topTicker = sortedStocks.length > 0 ? sortedStocks[0][0] : 'N/A';

    // PnL Calculation
    // Net PnL = End Value - (Deposits - Withdrawals)
    // Example: Start 0. Deposit 1000. Grow to 1200. PnL = 1200 - (1000) = 200.
    // Example: Start 0. Deposit 1000. Interest 10. Value 1010. PnL = 1010 - 1000 = 10. Correct.
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
