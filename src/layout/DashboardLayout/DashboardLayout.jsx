import TopBar from '../../features/dashboard/components/TopBar.jsx'
import SideBar from '../../features/dashboard/components/SideBar.jsx'
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
  