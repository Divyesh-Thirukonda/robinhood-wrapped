import { useState } from 'react';
import type { TradingYear } from './data/mockData';
import { mockData } from './data/mockData';
import { PnLSlide } from './components/slides/PnLSlide';
import { TopStockSlide } from './components/slides/TopStockSlide';
import { ArchetypeSlide } from './components/slides/ArchetypeSlide';
import { AIAnalysisSlide } from './components/slides/AIAnalysisSlide';
import { SummarySlide } from './components/slides/SummarySlide';
import { IntroSlide } from './components/slides/IntroSlide';
import { StoryContainer } from './components/StoryContainer';
import { OnboardingScreen } from './components/OnboardingScreen';
import './index.css';

function App() {
  // If data is null, show onboarding. If set, show story.
  const [data, setData] = useState<TradingYear | null>(null);

  if (!data) {
    return (
      <div className="app-container">
        <OnboardingScreen
          onDataLoaded={(d) => setData(d)}
          onDemoMode={() => setData(mockData)}
        />
      </div>
    );
  }

  const points = [
    <IntroSlide key="intro" />,
    <PnLSlide key="pnl" amount={data.netPnL} percentage={data.pnlPercentage} />,
    <TopStockSlide key="top-stock" stock={data.topStock} />,
    <ArchetypeSlide key="archetype" archetype={data.archetype} />,
    <AIAnalysisSlide key="ai" data={data} />,
    <SummarySlide key="summary" data={data} />
  ];

  return (
    <div className="app-container">
      <StoryContainer slides={points} />
      <button
        onClick={() => setData(null)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 100,
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          color: 'white',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          cursor: 'pointer'
        }}
        title="Close / Restart"
      >
        ✕
      </button>
    </div>
  );
}

export default App;
