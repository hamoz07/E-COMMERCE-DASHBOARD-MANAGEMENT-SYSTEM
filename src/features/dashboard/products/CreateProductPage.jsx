import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
// pages
import LoadingPage from "../../../components/feedback/LoadingPage.jsx";
// rrd
import { useNavigate } from "react-router-dom";
//  libraries
import { Form } from "react-bootstrap";
import { AX } from "../../../api/client.js";
import { CAT, PROD } from "../../../api/endpoints.js";
// imgs
import uploadimg from "../../../assets/upload-1118929_960_720.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema } from "../../../validations/createProductSchema";
import Input from "../../../components/forms/Input";
import SelectInput from "../../../components/forms/SelectInput";
import FileInput from "../../../components/forms/FileInput";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import Button from "../../../components/ui/Button/Button.jsx";
import { useAppDispatch } from "../../../store/hooks";
import { addToast } from "../../../store/toasts/toastSlice";

const UploadedImagePreview = memo(
  ({ image, index, onDelete, progressRef, containerRef }) => {
    const imageUrl = useMemo(() => URL.createObjectURL(image), [image]);
    const imageSizeInKb = image.size / 1024;

    useEffect(
      () => () => URL.revokeObjectURL(imageUrl),
      [imageUrl],
    );

    return (
      <div className="border p-3 w-100 rounded img-details" ref={containerRef}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2 justify-content-start">
            <img
              src={imageUrl}
              style={{ objectFit: "contain" }}
              width="80px"
              height="100px"
              alt={image.name}
            />
            <div>
              <p className="my-1">{image.name}</p>
              <p>
                <span style={{ color: "green" }} className="fw-bold">
                  {imageSizeInKb < 900
                    ? imageSizeInKb.toFixed(2)
                    : (image.size / (1024 * 1024)).toFixed(2)}
                </span>{" "}
                {imageSizeInKb >= 1000 ? "MB" : "KB"}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="danger"
            size="small"
            onClick={() => onDelete(index, image)}
          >
            Delete
          </Button>
        </div>
        <div className="progress-bar">
          <span ref={progressRef} className="actual-prog"></span>
        </div>
      </div>
    );
  },
);

UploadedImagePreview.displayName = "UploadedImagePreview";
UploadedImagePreview.propTypes = {
  image: PropTypes.instanceOf(File).isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  progressRef: PropTypes.func.isRequired,
  containerRef: PropTypes.func.isRequired,
};

const CreateProduct = () => {
  const dispatch = useAppDispatch();
  // refs and naving
  const cat = useRef("");
  const showimg = useRef(null);
  const spanProg = useRef([]);
  const Progdiv = useRef([]);
  const myi = useRef(-1);
  const myimdIds = useRef([]);
  const navTo = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(createProductSchema),
    mode: "onBlur",
    defaultValues: {
      category: "",
      title: "",
      description: "",
      price: "",
      discount: "",
      stock: "",
      About: "",
    },
  });

  // states
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [disable, setDisable] = useState(true);
  const [checkItems, setCheckItems] = useState(false);
  const [image, setImage] = useState([]);
  const [prodid, setProdid] = useState(null);
  const [categories, setCategories] = useState([]);
  const selectedCategory = watch("category");
  // useEffects
  useEffect(() => {
    if (cat.current) cat.current.focus();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function getCats() {
      try {
        const response = await AX.get(`/${CAT}`, {
          signal: controller.signal,
        });
        setCategories(response.data);
        setCheckItems(true);
      } catch (error) {
        if (controller.signal.aborted) return;

        setEmailError(axiosErrorHandler(error) || "Unable to load categories.");
        setCheckItems(true);
      }
    }

    getCats();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const createDraftProduct = async () => {
      setEmailError("");

      try {
        const response = await AX.post(`/${PROD}/add`, {
          category: null,
          title: "dummy",
          description: "dummy",
          price: 222,
          discount: 0,
          stock: 0,
          About: "About",
        }, {
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setProdid(response.data.id);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          const errorMsg = axiosErrorHandler(error);
          console.log(errorMsg)
          setEmailError(errorMsg || "Unable to initialize product.");
        }
      }
    };

    createDraftProduct();
    return () => controller.abort();
  }, []);

    useEffect(() => {
    if (checkItems && prodid && selectedCategory) {
      setDisable(false);
    } else {
      setDisable(true); // Safely re-disable if they clear the category selection
    }
  }, [checkItems, prodid, selectedCategory]); 

  // handling created data
  const EditForm = async (validatedData) => {
    setLoading(true);
    try {
      await AX.post(`/${PROD}/edit/${prodid}`, validatedData);
      dispatch(
        addToast({
          title: "Product created",
          type: "success",
          message: "The product was created successfully.",
        }),
      );
      navTo("/dashboard/products");
      window.scrollTo(0, 0);
    } catch (error) {
      const errorMsg = axiosErrorHandler(error);
      const message = errorMsg || "Unable to create product.";
      setEmailError(message);
      dispatch(
        addToast({
          title: "Unable to create product",
          type: "danger",
          message,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const DelImg = useCallback(async (id, image) => {
    const realId = myimdIds.current[id];
    console.log(realId)
    try {
      await AX.delete(`product-img/${realId}`);
      setImage((previousImages) =>
        previousImages.filter((currentImage) => currentImage !== image),
      );
      myimdIds.current = myimdIds.current.filter(
        (imageId) => imageId !== realId,
      );
      myi.current -= 1;
    } catch (error) {
      console.error("Unable to delete product image:", error);
    }
  }, []);

  const cats = useMemo(
    () =>
      categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.title}
        </option>
      )),
    [categories],
  );

  const showImages = useMemo(
    () =>
      image.map((currentImage, index) => (
        <UploadedImagePreview
          key={`${currentImage.name}-${currentImage.lastModified}-${index}`}
          image={currentImage}
          index={index}
          onDelete={DelImg}
          progressRef={(element) => (spanProg.current[index] = element)}
          containerRef={(element) => (Progdiv.current[index] = element)}
        />
      )),
    [image, DelImg],
  );


  const imagesChange = useCallback(async (event) => {
    setImage((previousImages) => [
      ...previousImages,
      ...event.target.files,
    ]);
    const imgfiles = event.target.files;
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
        myimdIds.current[myi.current] = response.data.id;
      } catch (error) {
        console.log(error);
      }
    }
  }, [prodid]);


  return (
    <>
      {loading && <LoadingPage mt="0" mh={"100vh"} bg="#fff" />}
      <Form className="w-100 app-surface p-3" onSubmit={handleSubmit(EditForm)}>
        <SelectInput
          label="Category"
          name="category"
          register={register}
          error={errors.category?.message}
          isSubmitted={isSubmitted}
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
        <Button
          type="submit"
          loading={loading}
          disabled={disable}
          loadingText="create product"
          className="my-3"
        >
          create product
        </Button>
        {emailError && <p className="error">{emailError}</p>}
      </Form>
    </>
  );
};

export default CreateProduct;
