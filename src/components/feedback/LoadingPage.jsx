const LoadingPage = ({mt,mh,bg,inTable = false,text}) => {
  console.log(inTable)
  console.log(inTable)
  return (
    <div className={`spinner-container ${inTable ? "spinner-container-in-table" : ""}`}
      aria-live="polite"
      style={{
        marginTop: mt,minHeight: mh,
      }}
    >
      <div className="spinner"></div>
      {/* text */}
      {text && <span className="loading-text">{text}...</span>}
    </div>
  )
}

export default LoadingPage
