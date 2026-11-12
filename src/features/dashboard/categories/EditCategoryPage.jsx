/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
// import { REGISTERREQ, baseURL } from "../../../api/endpoints.js";
import LoadingPage from "../../../components/feedback/LoadingPage.jsx";
// rrd
import { useNavigate, useParams } from "react-router-dom";
//  libraries
import { Form } from "react-bootstrap";

import { AX } from "../../../api/client.js";
import { ONECAT } from "../../../api/endpoints.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editCategorySchema } from "../../../validations/editCategorySchema";
import Input from "../../../components/forms/Input";
import FileInput from "../../../components/forms/FileInput";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import Button from "../../../components/ui/Button/Button.jsx";
import { useAppDispatch } from "../../../store/hooks";
import { addToast } from "../../../store/toasts/toastSlice";

const EditCategory = () => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  let {id} = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(editCategorySchema),
    mode: "onBlur",
    defaultValues: { title: "", image: "" },
  });
  const cat = useRef(null);

  useEffect(()=>{
    if(cat.current) cat.current.focus()
  },[])

  useEffect(() => {
    const controller = new AbortController();

    const getCategory = async () => {
      setLoading(true);
      setEmailError("");

      try {
        const response = await AX.get(`${ONECAT}/${id}`, {
          signal: controller.signal,
        });

        reset({
          title: response.data.title,
          image: "",
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        setEmailError(axiosErrorHandler(error) || "Unable to load category.");
        nav("/dashboard/categories/page/404", { replace: true });
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    getCategory();
    return () => controller.abort();
  }, [id, nav, reset]);

  const submitForm = async (formData) => {
    setLoading(true);
    const formAppended = new FormData()

    formAppended.append("title",formData.title)
    if (formData.image.length > 0) {
      formAppended.append("image", formData.image[0]);
    }

    try {
      const response = await AX.post(`/${ONECAT}/edit/${id}`, formAppended);
      dispatch(
        addToast({
          title: "Category updated",
          type: "success",
          message: "The category was updated successfully.",
        }),
      );
      nav("/dashboard/categories");
      setEmailError("");
    } catch (error) {
      const errorMsg = axiosErrorHandler(error);
      setEmailError(errorMsg || "Unable to update category.");
      dispatch(
        addToast({
          title: "Unable to update category",
          type: "danger",
          message: errorMsg || "Please try again.",
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
        <Input
          label="Title"
          name="title"
          register={register}
          error={errors.title?.message}
          isSubmitted={isSubmitted}
          placeholder="Title..."
          ref={cat}
        />
        <FileInput
          label="Image"
          name="image"
          register={register}
          error={errors.image?.message}
          accept="image/*"
        />

        <Button type="submit" loading={loading} loadingText="save">
          save
        </Button>
        {emailError && <p className="error">{emailError}</p>}
      </Form>
    </>
  );
};

export default EditCategory;
