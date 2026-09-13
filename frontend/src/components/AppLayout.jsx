import Sidebar from './Sidebar'
import Navbar from './Navbar'
import GlobalBackground from './GlobalBackground'

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#04070e] relative overflow-hidden flex flex-col lg:flex-row">
      <GlobalBackground />

      <div className="hidden lg:flex relative z-10">
        <Sidebar />
      </div>
      <div className="lg:hidden relative z-10">
        <Navbar />
      </div>

      <div className="flex-1 min-w-0 relative z-10">
        {children}
      </div>
    </div>
  )
}