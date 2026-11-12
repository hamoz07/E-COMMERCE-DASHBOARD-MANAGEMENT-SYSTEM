import { useEffect, useRef, useState } from "react";
import LoadingPage from "../../../components/feedback/LoadingPage.jsx";
// rrd
import { useNavigate } from "react-router-dom";
//  libraries
import { Form } from "react-bootstrap";
import { AX } from "../../../api/client.js";
import { CAT, CATADD } from "../../../api/endpoints.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategorySchema } from "../../../validations/createCategorySchema";
import Input from "../../../components/forms/Input";
import FileInput from "../../../components/forms/FileInput";
import Button from "../../../components/ui/Button/Button.jsx";
import { useAppDispatch } from "../../../store/hooks";
import { addToast } from "../../../store/toasts/toastSlice";

const CreateCategory = () => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(createCategorySchema),
    mode: "onBlur",
    defaultValues: { title: "", image: "" },
  });

  const cat = useRef(null);

  useEffect(() => {
    if (cat.current) {
      cat.current.focus();
    }
  }, []);



  const submitForm = async (formData) => {
    setLoading(true);
    const formAppended = new FormData();

    formAppended.append("title", formData.title);
    formAppended.append("image", formData.image[0]);

    try {
      await AX.post(`/${CATADD}`, formAppended);
      dispatch(
        addToast({
          title: "Category created",
          type: "success",
          message: "The category was created successfully.",
        }),
      );
      nav(`/dashboard/${CAT}`);
    } catch (error) {
      dispatch(
        addToast({
          title: "Unable to create category",
          type: "danger",
          message: error.response?.data?.message || "Please try again.",
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

        <Button type="submit" loading={loading} loadingText="create category">
          create category
        </Button>
      </Form>
    </>
  );
};

export default CreateCategory;
