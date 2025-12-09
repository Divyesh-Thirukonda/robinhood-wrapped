export interface Stock {
    symbol: string;
    name: string;
    gain: number; // Percentage
    value: number; // Current value
    logo: string; // Placeholder color or url
}

export interface TradingYear {
    totalDeposits: number;
    totalWithdrawals: number;
    netPnL: number;
    pnlPercentage: number;
    totalTrades: number;
    topStock: Stock;
    worstStock: Stock;
    archetype: 'Diamond Hands' | 'Day Trader' | 'FOMO Buyer' | 'Value Investor';
}

export const mockData: TradingYear = {
    totalDeposits: 25000,
    totalWithdrawals: 1200,
    netPnL: 8450.25,
    pnlPercentage: 32.4,
    totalTrades: 420,
    topStock: {
        symbol: 'NVDA',
        name: 'NVIDIA Corp',
        gain: 245.5,
        value: 12500,
        logo: '#76b900'
    },
    worstStock: {
        symbol: 'AMC',
        name: 'AMC Entertainment',
        gain: -45.2,
        value: 200,
        logo: '#E01E2E'
    },
    archetype: 'Diamond Hands'
};
