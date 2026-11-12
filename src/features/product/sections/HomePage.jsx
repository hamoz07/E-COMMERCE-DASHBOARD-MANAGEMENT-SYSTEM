import React from 'react'
import LatestSaleProduct from './LatestSaleProducts.jsx'
import TopRatedProduct from './TopRatedProducts.jsx'
import TopProduct from './TopProducts.jsx'

const HomePage = () => {
  return (
    <div style={{position:'relative'}}>
      {/* LANDING */}
      <div 
      className='p-2'
      >

      Home
      {/* Landing page here later */}
      </div>
        {/* LATEST PRODUCTA */}
      <h1>Deal Of The Day</h1>
        <LatestSaleProduct />
      <h1>Top Rated Products</h1>
        <TopRatedProduct />
      <h1>latest products</h1>
      <TopProduct />

    </div>
  )
}

export default HomePage
