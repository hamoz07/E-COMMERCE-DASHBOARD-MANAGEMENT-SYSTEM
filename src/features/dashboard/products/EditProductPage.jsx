import { useEffect, useRef, useState } from "react";
// import { REGISTERREQ, baseURL } from "../../../api/endpoints.js";
import LoadingPage from "../../../components/feedback/LoadingPage.jsx";
// rrd
import { useNavigate, useParams } from "react-router-dom";
//  libraries
import { Form } from "react-bootstrap";
// imgs
import uploadimg from "../../../assets/upload-1118929_960_720.png";
import { AX } from "../../../api/client.js";
import { CAT, PROD } from "../../../api/endpoints.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProductSchema } from "../../../validations/editProductSchema";
import Input from "../../../components/forms/Input";
import SelectInput from "../../../components/forms/SelectInput";
import FileInput from "../../../components/forms/FileInput";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import Button from "../../../components/ui/Button/Button.jsx";
import { useAppDispatch } from "../../../store/hooks";
import { addToast } from "../../../store/toasts/toastSlice";

const EditProduct = () => {
  const dispatch = useAppDispatch();
  // refs and navs
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(editProductSchema),
    mode: "onBlur",
    defaultValues: {
      category: "",
      title: "",
      description: "",
      price: "",
      discount: "",
      About: "",
    },
  });
  const cat = useRef(null);
  const showimg = useRef(null);
  const spanProg = useRef([]);
  const Progdiv = useRef([]);
  const myi = useRef(-1);
  const myimdIds = useRef([]);
  //
  const [disable, setDisable] = useState(true);
  const [image, setImage] = useState([]);
  const [imagesFromServer, setImagesFromServer] = useState([]);
  const [idsOfImagesFromServer, setIdsOfImagesFromServer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [categories, setCategories] = useState([]);
  let { id } = useParams();

  // effects
  useEffect(() => {
    if(cat.current) cat.current.focus();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function getProds() {
      setLoading(true);
      setEmailError("");

      try {
        const response = await AX.get(`/${PROD}/${id}`, {
          signal: controller.signal,
        });
        const product = response.data[0];

        reset({
          category: String(product.category ?? ""),
          title: product.title ?? "",
          description: product.description ?? "",
          price: String(product.price ?? ""),
          discount: String(product.discount ?? ""),
          stock: String(product.stock ?? ""),
          About: product.About ?? "",
        });
        setImagesFromServer(product.images ?? []);
        setDisable(false);
      } catch (error) {
        if (controller.signal.aborted) return;

        setEmailError(axiosErrorHandler(error) || "Unable to load product.");
        nav("/dashboard/categories/page/404", { replace: true });
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    getProds();
    return () => controller.abort();
  }, [id, nav, reset]);

  useEffect(() => {
    const controller = new AbortController();

    async function getCats() {
      try {
        const response = await AX.get(`/${CAT}`, {
          signal: controller.signal,
        });
        setCategories(response.data);
      } catch (error) {
        if (!controller.signal.aborted) {
          setEmailError(
            axiosErrorHandler(error) || "Unable to load categories.",
          );
        }
      }
    }

    getCats();
    return () => controller.abort();
  }, []);

  const cats = categories.map((cat, i) => {
    return (
      <option key={i} value={cat?.id}>
        {cat.title}
      </option>
    );
  });

  const DelImg = async (id, image) => {
    const realId = myimdIds.current[id];
    try {
      const res = await AX.delete(`product-img/${realId}`);
      console.log(res);
      setImage(pre => pre.filter((img) => img !== image));
      myimdIds.current = myimdIds.current.filter((e) => e !== realId);
      --myi.current;
    } catch (error) {
      console.log(error);
    }
  };
  
  const DelImgFromServer = async (id) => {
    setImagesFromServer((pre) => pre.filter((img) => img.id !== id));
    setIdsOfImagesFromServer(p =>  [...p,id])
  };

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
          <div className="d-flex align-items-center gap-2 justify-content-start">
            <img
              src={URL.createObjectURL(img)}
              style={{ objectFit: "contain" }}
              width="80px"
              height="100px"
              alt={img.name}
            />
            <div className="d-flex justify-content-between align-items-start">
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
          <Button
            type="button"
            variant="danger"
            size="small"
            onClick={() => DelImg(i, img)}
          >
            Delete
          </Button>
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
  const showImagesOfServer = imagesFromServer?.map((img, i) => {
    return (
      <div className="p-2 col-2 position-relative border" key={i}>
        <div className="d-flex align-items-center justify-content-start">
          <img src={img.image} id={img.id} className={"w-100"} alt={img.name} />
        </div>
        <div className="position-absolute top-0 end-0 bg-danger rounded text-white">
          <Button
            variant="danger"
            size="small"
            iconOnly
            ariaLabel="Delete image"
            type="button"
            onClick={() => DelImgFromServer(img.id)}
          >
            X
          </Button>
        </div>
      </div>
    );
  });
  const imagesChange = async (e) => {
    setImage((prevstate) => [...prevstate, ...e.target.files]);
    const imgfiles = e.target.files;
    const imgsOfProd = new FormData();
    for (let i = 0; i < imgfiles.length; i++) {
      myi.current++;
      imgsOfProd.append("image", imgfiles[i]);
      imgsOfProd.append("product_id", id);
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
        myimdIds.current[myi.current] = response.data.id;
      } catch (error) {
        console.log(error);
      }
    }
    console.log(imgsOfProd);
  };

  
  const submitForm = async (validatedData) => {
    setLoading(true);
    const prodsdata = new FormData();
    prodsdata.append("title", validatedData.title);
    prodsdata.append("description", validatedData.description);
    prodsdata.append("price", validatedData.price);
    prodsdata.append("discount", validatedData.discount);
    prodsdata.append("About", validatedData.About);
    prodsdata.append("category", validatedData.category);
    console.log(prodsdata);

    try {
      for (let i = 0; i < idsOfImagesFromServer.length; i++) {
          await AX.delete(`product-img/${idsOfImagesFromServer[i]}`).then(lo => console.log(lo))
      }
      await AX.post(`/${PROD}/edit/${id}`, prodsdata);
      await new Promise((res) => setTimeout(res, 200));
      window.scrollTo(0, 0);
      dispatch(
        addToast({
          title: "Product updated",
          type: "success",
          message: "The product was updated successfully.",
        }),
      );
      nav("/dashboard/products");
    } catch (error) {
      const errorMsg = axiosErrorHandler(error);
      const message = errorMsg || "Unable to update product.";
      setEmailError(message);
      dispatch(
        addToast({
          title: "Unable to update product",
          type: "danger",
          message,
        }),
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      {loading && <LoadingPage mt="0" mh={"100vh"} bg="#fff" />}

      <Form className="w-100 app-surface p-3" onSubmit={handleSubmit(submitForm)}>
        <SelectInput
          label="Category"
          name="category"
          register={register}
          error={errors.category?.message}
          isSubmitted={isSubmitted}
          disabled={disable}
          ref={cat}
        >
            <option defaultValue disabled value={""}>
              select a product category
            </option>
            {cats}
        </SelectInput>
        <Input label="Title" name="title" register={register}
          error={errors.title?.message} isSubmitted={isSubmitted} placeholder="Title..." disabled={disable} />
        <Input label="Description" name="description" register={register}
          error={errors.description?.message} isSubmitted={isSubmitted} placeholder="Description..." disabled={disable} />
        <Input label="Price" name="price" register={register}
          error={errors.price?.message} isSubmitted={isSubmitted} placeholder="Price..." disabled={disable} />
        <Input label="Discount" name="discount" register={register}
          error={errors.discount?.message} isSubmitted={isSubmitted} placeholder="Discount..." disabled={disable} />
        <Input label="Stock" name="stock" register={register}
          error={errors.stock?.message} isSubmitted={isSubmitted} placeholder="Stock..." disabled={disable} />
        <Input label="About" name="About" register={register}
          error={errors.About?.message} isSubmitted={isSubmitted} placeholder="About..." disabled={disable} />
        <FileInput
          name="images"
          register={register}
          onChange={imagesChange}
          hidden
          multiple
          disabled={disable}
          ref={showimg}
        />
        <div
          className="d-flex justify-content-center align-items-center flex-column py-4 mb-2 w-100 mt-1"
          style={{
            border: disable ? "2px dashed grey" : "2px dashed #0086fe",
            cursor: disable ? "not-allowed" : "pointer",
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
          <div className="d-flex flex-column gap-1 mb-1">{showImages}</div>
        )}
        {imagesFromServer.length >= 1 && (
          <div className="d-flex align-items-start gap-2 flex-wrap ">
            {showImagesOfServer}
          </div>
        )}
        <Button type="submit" disabled={disable}>
          save
        </Button>
        {emailError && <p className="error">{emailError}</p>}
      </Form>
    </>
  );
};

export default EditProduct;
