import TopBar from './components/TopBar.jsx'
import SideBar from './components/SideBar.jsx'
import { Outlet } from 'react-router-dom'
import './DashboardLayout.css'

const Dashboard = () => {
    return (
      <div className="posi-rel dashboard">
        <TopBar />
        <div className="d-flex" style={{marginTop:"70px"}}>
        <SideBar />
        
          <Outlet />
        
      </div>
      </div>
    )
  }
  
  export default Dashboard
  