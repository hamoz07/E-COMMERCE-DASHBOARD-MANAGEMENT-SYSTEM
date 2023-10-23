import { Link } from 'react-router-dom'

const Error404 = () => {
  return (
    <main className="error-page">
  <div className="my-container my-h-100">
    <div className="eyes">
      <div className="eye">
        <div className="eye__pupil eye__pupil--left"></div>
      </div>
      <div className="eye">
        <div className="eye__pupil eye__pupil--right"></div>
      </div>
    </div>

    <div className="error-page__heading">
      <h1 className="error-page__heading-title">{"Looks like you're lost"}</h1>
      <p className="error-page__heading-desciption">404 error</p>
      <p className="error-page__heading-small-desciption">{"this page doesn't exist !"}</p>
      </div>

    <Link className="error-page__button" to="/" aria-label="back to home" title="back to home">back to home</Link>
  </div>

</main>

  )
}

export default Error404
