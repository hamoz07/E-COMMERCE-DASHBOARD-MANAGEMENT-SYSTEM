import React from 'react'

const LoadingPage = ({mt,mh,bg}) => {
  return (
    <div  className='spinner-container' style={{marginTop: mt,minHeight: mh,background:bg}}>
      <div className="spinner"></div>
    </div>
  )
}

export default LoadingPage
