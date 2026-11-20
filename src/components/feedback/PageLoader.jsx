import "./page-loader.css";

const PageLoader = ({text}) => {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <div className="page-loader__spinner" aria-hidden="true" />
      <span className="page-loader__text">{text || "Loading page..."}...</span>
    </div>
  );
};

export default PageLoader;
