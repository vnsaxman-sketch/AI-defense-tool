import { useState } from 'react'
import SimulatorTab from './components/SimulatorTab'
import HabitLabTab from './components/HabitLabTab'
import BiasDetectorTab from './components/BiasDetectorTab'
import type { Tab } from './types'

const tabs: { id: Tab; label: string }[] = [
  { id: 'simulator', label: 'Simulator' },
  { id: 'habit', label: 'My Habit Lab' },
  { id: 'bias', label: 'Bias Detector' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('simulator')

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <div className="eyebrow">PLAYER-SIDE STATISTICAL DEFENSE</div>
          <h1>Adaptive Shuffle Defense Lab</h1>
          <p>
            Analyze randomness, betting behavior, and recorded baccarat
            outcomes without attempting to influence casino equipment.
          </p>
	  <p>
            Developed by: Long Nguyen
          </p>
        </div>
      </header>

      <nav className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {activeTab === 'simulator' && <SimulatorTab />}
        {activeTab === 'habit' && <HabitLabTab />}
        {activeTab === 'bias' && <BiasDetectorTab />}
      </main>

      <footer className="app-footer">
        <strong>Educational/statistical tool.</strong>
        {' '}
        An unusual result is not proof of AI involvement, manipulation, or
        unfair dealing. Real-world casino rules and applicable law control
        device use at a table.
      </footer>
    </div>
  )
}
