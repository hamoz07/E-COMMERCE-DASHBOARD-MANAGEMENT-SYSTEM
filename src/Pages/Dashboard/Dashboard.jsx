import TopBar from '../../components/Dashboard/TopBar.jsx'
import SideBar from '../../components/Dashboard/SideBar.jsx'
import { Outlet } from 'react-router-dom'
import './Dashboard.css'

const Dashboard = () => {
    return (
      <div className="posi-rel dashboard">
        <TopBar />
        <div className="d-flex" style={{marginTop:"70px"}}>
        <SideBar />
        
          <Outlet></Outlet>
        
      </div>
      </div>
    )
  }
  
  export default Dashboard
  