import React from 'react'
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div>
        <footer className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 my-5 border-top">
    <div className="col mb-3">
      <a href="/" className="d-flex align-items-center mb-3 link-dark text-decoration-none">
        <svg className="bi me-2" width="40" height="32"><use xlinkHref="#bootstrap"/></svg>
      </a>
      <p className="text-muted">
        
      </p>
    </div>

    <div className="col mb-3">
    <div className="follow-utc ">
                    <h6 className="ng-tns-c0-0 d-flex justify-content-center align-items-center">Theo dõi UTC</h6>
                    <div className="social d-flex justify-content-center align-items-center">
        <a className="ng-tns-c0-0 m-3" href="https://www.facebook.com">
            <i className="bi bi-facebook fs-3"></i> {/* fs-3 để tăng kích thước */}
        </a>
                    <a className="ng-tns-c0-0 m-3" href="https://youtube.com">
            <i className="bi bi-youtube fs-3"></i> {/* fs-3 để tăng kích thước */}
        </a>
            <a className="ng-tns-c0-0 m-3" href="https://twitter.com">
            <i className="bi bi-twitter fs-3"></i> {/* fs-3 để tăng kích thước */}
        </a>
                <a className="ng-tns-c0-0 m-3" href="https://plus.google.com/">
            <i className="bi bi-google fs-3"></i> {/* fs-3 để tăng kích thước */}
        </a>
</div>
    </div>
    </div>

    <div className="col mb-3">
      <h5></h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted"></a></li>
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted"></a></li>
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted"></a></li>
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted"></a></li>
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted"></a></li>
      </ul>
    </div>

    <div className="col mb-3">
      <h5>Nhóm 9</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Nịnh Văn Nam</a></li>
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Nguyễn Thị Phương Anh</a></li>
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Phạm Thị Hà</a></li>
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Nguyễn Thanh Thảo</a></li>
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Nguyễn Anh Tuấn</a></li>
      </ul>
    </div>

  </footer>
    </div>
  )
}

export default Footer;
