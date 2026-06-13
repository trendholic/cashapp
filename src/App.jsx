import { Route, Routes, useLocation } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import TabBar from './components/TabBar'
import Home from './screens/Home'
import Send from './screens/Send'
import Search from './screens/Search'
import Activity from './screens/Activity'
import Profile from './screens/Profile'
import Admin from './screens/Admin'

export default function App() {
  const location = useLocation()
  const hideTabs = location.pathname === '/send'

  return (
    <ToastProvider>
      <div className="phone">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/send" element={<Send />} />
          <Route path="/search" element={<Search />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Home />} />
        </Routes>
        {!hideTabs && <TabBar />}
      </div>
    </ToastProvider>
  )
}
