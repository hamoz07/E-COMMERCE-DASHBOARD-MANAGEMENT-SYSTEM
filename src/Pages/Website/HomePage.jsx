import React from 'react'
import TopBar from '../../components/Dashboard/TopBar'

const HomePage = () => {
  return (
    <div style={{position:'relative'}}>
      <TopBar />
      <div style={{height:"calc(100vh - 70px)"}}
      className='p-2'
      >

      Home
      </div>
    </div>
  )
}

export default HomePage
