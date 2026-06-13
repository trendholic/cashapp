import { Route, Routes, useLocation } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import TabBar from './components/TabBar'
import Home from './screens/Home'
import Send from './screens/Send'
import Activity from './screens/Activity'
import Profile from './screens/Profile'

export default function App() {
  const location = useLocation()
  // Hide the tab bar on the full-screen send/request flow
  const hideTabs = location.pathname === '/send'

  return (
    <ToastProvider>
      <div className="phone">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/send" element={<Send />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Home />} />
        </Routes>
        {!hideTabs && <TabBar />}
      </div>
    </ToastProvider>
  )
}
