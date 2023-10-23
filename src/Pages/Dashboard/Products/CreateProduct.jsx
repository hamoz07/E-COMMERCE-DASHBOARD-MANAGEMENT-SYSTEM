/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState } from "react";
// pages
import LoadingPage from "../../loading";
// rrd
import { useNavigate } from "react-router-dom";
//  libraries
import { Form } from "react-bootstrap";
import { AX } from "../../../Api/AxiosShortCut";
import { CAT, PROD } from "../../../Api/api";
// imgs
import uploadimg from "../../../assets/upload-1118929_960_720.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const CreateProduct = () => {
  // refs and naving
  const cat = useRef("");
  const showimg = useRef(null);
  const spanProg = useRef([]);
  const Progdiv = useRef([]);
  const navTo = useNavigate();
  let [img_id, setImgId] = useState();

  // states
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [uploading, setUploading] = useState();
  const [formStatus, setFormStatus] = useState(false);
  const [checkItems, setCheckItems] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    price: "",
    discount: "",
    About: "",
  });
  const [image, setImage] = useState([]);
  const [prodid, setProdid] = useState(null);
  const [categories, setCategories] = useState([]);
  const dummydata = {
    categories: null,
    title: "dummy",
    description: "dummy",
    price: 222,
    discount: 0,
    About: "About",
  };

  

  // mapping on data
  const cats = categories?.map((cat, i) => {
    return (
      <option key={i} value={cat.id}>
        {cat.title}
      </option>
    );
  });

  const showImages = image.map((img, i) => {
    const imgSize = img.size / 1024;
    const imgSizeShown = img.size / 1024;

    return (
      <div
        className="border p-3 w-100 rounded img-details"
        key={i}
        ref={(e) => (Progdiv.current[i] = e)}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <img
              src={URL.createObjectURL(img)}
              style={{ objectFit: "contain" }}
              width="80px"
              alt={img.name}
            />
            <div>
              <p className="my-1">{img.name}</p>
              <p>
                <span style={{ color: "green" }} className="fw-bold">
                  {imgSizeShown < 900
                    ? imgSizeShown.toFixed(2)
                    : (img.size / (1024 * 1024)).toFixed(2)}
                </span>{" "}
                {imgSize >= 1000 ? "MB" : "KB"}
              </p>
            </div>
          </div>
        </div>
        <div className="progress-bar">
          <span
            ref={(e) => (spanProg.current[i] = e)}
            className="actual-prog"
          ></span>
        </div>
      </div>
    );
  });

  // useEffects
  useEffect(() => {
    cat.current.focus();
  }, []);

  useEffect(() => {
    async function getCats() {
      const res = await AX.get(`/${CAT}`).then((res) => {
        setCategories(res.data);
        setCheckItems(categories.length === 0 ? true : false);
      });
    }
    getCats();
  }, []);

  useEffect(() => {
    if (!disable) {
      initialSubmit();
    }
  }, [disable]);

  // handling created data
  const EditForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormStatus(true);
    try {
      const prodsdata = new FormData();
      prodsdata.append("title", formData.title);
      prodsdata.append("description", formData.description);
      prodsdata.append("price", formData.price);
      prodsdata.append("discount", formData.discount);
      prodsdata.append("About", formData.About);
      prodsdata.append("category", formData.category);
      for (let i = 0; i < image.length; i++) {
        prodsdata.append("images[]", image[i]);
      }

      const res = await AX.post(`/${PROD}/edit/${prodid}`, prodsdata);
      setLoading(false);
      navTo("/dashboard/products");
      window.scrollTo(0, 0);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  async function initialSubmit() {
    try {
      const response = await AX.post(`/${PROD}/add`, dummydata);
      
      setProdid(response.data.id);
    } catch (error) {
      console.log(error);
    }
  }

  // input changes
  const detectChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setDisable(false);
  };

  const myi = useRef(-1);

  const imagesChange = async (e) => {
    setImage((prevstate) => [...prevstate, ...e.target.files]);
    const imgfiles = e.target.files;
    const imgsOfProd = new FormData();
    for (let i = 0; i < imgfiles.length; i++) {
      myi.current++;
      imgsOfProd.append("image", imgfiles[i]);
      imgsOfProd.append("product_id", prodid);

      try {
        const response = await AX.post(`/product-img/add`, imgsOfProd, {
          onUploadProgress: (prog) => {
            const progress = Math.floor((100 * prog.loaded) / prog.total);
            if (progress % 5 === 0) {
              spanProg.current[myi.current].style.width = `${progress}%`;
              Progdiv.current[myi.current].setAttribute(
                "percent",
                `${progress ?? 0}%`
              ); // line 172
            }
          },
        });
        
        setImgId(response.data.id);
      } catch (error) {
        console.log(error);
      }
    }
  };



  return (
    <>
      {loading && <LoadingPage mt="0" mh={"100vh"} bg="#fff" />}
      <Form className="w-100 bg-white p-3" onSubmit={EditForm}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>category</Form.Label>
          <Form.Select
            name="category"
            onChange={detectChange}
            value={formData.category}
            ref={cat}
          >
            <option defaultValue disabled value={""}>
              select a product category
            </option>
            {!checkItems ? (
              <option disabled value={null}>
                loading...
              </option>
            ) : checkItems && categories.length === 0 ? (
              <option disabled value={null}>
                no categories found
              </option>
            ) : (
              cats
            )}
          </Form.Select>
          {formData.category === "" && formStatus && (
            <p className="error">please select a category</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
          <Form.Label>title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            onChange={detectChange}
            value={formData.title}
            placeholder="title..."
            disabled={disable}
          />

          {formData.title.trim().length < 4 && formStatus && (
            <p className="error">title should be 3 characters at least</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
          <Form.Label>description</Form.Label>
          <Form.Control
            onChange={detectChange}
            type="text"
            value={formData.description}
            name="description"
            placeholder="description..."
            disabled={disable}
          />
          {formData.description === "" && formStatus && (
            <p className="error">please describe the product</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
          <Form.Label>price</Form.Label>
          <Form.Control
            onChange={detectChange}
            type="text"
            value={formData.price}
            name="price"
            placeholder="price..."
            disabled={disable}
          />
          {isNaN(+formData.price) && formStatus && (
            <p className="error">please enter a number</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
          <Form.Label>discount</Form.Label>
          <Form.Control
            onChange={detectChange}
            type="text"
            value={formData.discount}
            name="discount"
            placeholder="discount..."
            disabled={disable}
          />
          {isNaN(+formData.discount) && formStatus && (
            <p className="error">please enter a number</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
          <Form.Label>about</Form.Label>
          <Form.Control
            onChange={detectChange}
            type="text"
            value={formData.About}
            name="About"
            placeholder="about..."
            disabled={disable}
          />
          {formData.About === "" && formStatus && (
            <p className="error">please tells us more about your product</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput7">
          <Form.Label>images</Form.Label>
          <Form.Control
            onChange={imagesChange}
            type="file"
            hidden
            multiple
            disabled={disable}
            ref={showimg}
          />
        </Form.Group>
        <div
          className="d-flex justify-content-center align-items-center flex-column py-4 mb-2 w-100 mt-1"
          style={{
            border: disable ? "2px dashed gray" : "2px dashed #0086fe",
            cursor: "pointer",
          }}
          onClick={() => showimg.current.click()}
        >
          <img
            src={uploadimg}
            alt="upload"
            width={"90px"}
            style={{ filter: disable ? "grayscale(1)" : "" }}
          />
          <p
            className="fw-bold mt-2 mb-0"
            style={{ color: disable ? "gray" : "#0086fe" }}
          >
            Upload images
          </p>
        </div>

        {image.length >= 1 && (
          <div className="d-flex flex-column gap-1">{showImages}</div>
        )}
        <button
          disabled={
            formData.title.length === "" ||
            formData.price === "" ||
            formData.discount === "" ||
            formData.About === "" ||
            formData.description === "" ||
            formData.category === ""
              ? true
              : false
          }
          className="btn btn-primary my-3"
        >
          create product
        </button>
      </Form>
    </>
  );
};

export default CreateProduct;
