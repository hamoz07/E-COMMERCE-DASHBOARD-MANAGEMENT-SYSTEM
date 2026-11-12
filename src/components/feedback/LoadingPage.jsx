const LoadingPage = ({mt,mh,bg,inTable = false}) => {
  console.log(inTable)
  return (
    <div  className={`spinner-container ${inTable && 'table-spinner'}`} 
    style={{
      marginTop: mt,minHeight: mh,
    }}
    >
      <div className="spinner"></div>
    </div>
  )
}

export default LoadingPage
