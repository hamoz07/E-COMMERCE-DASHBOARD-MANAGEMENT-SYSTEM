import { useEffect, useRef, useState } from "react";
// import { REGISTERREQ, baseURL } from "../../../api/endpoints.js";
import LoadingPage from "../../../components/feedback/LoadingPage.jsx";
// rrd
import { useNavigate } from "react-router-dom";
//  libraries
import { Form } from "react-bootstrap";
import { AX } from "../../../api/client.js";
import { ONEUSERREQ } from "../../../api/endpoints.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "../../../validations/createUserSchema";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import Input from "../../../components/forms/Input";
import SelectInput from "../../../components/forms/SelectInput";
import Button from "../../../components/ui/Button/Button.jsx";
import { useAppDispatch } from "../../../store/hooks";
import { addToast } from "../../../store/toasts/toastSlice";

const CreateUser = () => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(createUserSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", role: "", password: "" },
  });
  const nameRef = useRef(null);

  useEffect(() => {
    if(nameRef.current){
      nameRef.current.focus();
    }
  }, []);

  const submitForm = async (formData) => {
    setLoading(true);
    setEmailError("");
    try {
      await AX.post(`/${ONEUSERREQ}/add`, formData);
      setEmailError("");
      dispatch(
        addToast({
          title: "User created",
          type: "success",
          message: "The user was created successfully.",
        }),
      );
      nav("/dashboard/users");
    } catch (error) {
      const errorMsg = axiosErrorHandler(error);
      const message = errorMsg || "Unable to create user.";
      setEmailError(message);
      dispatch(
        addToast({
          title: "Unable to create user",
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
        <Input
          label="Name"
          name="name"
          register={register}
          error={errors.name?.message}
          isSubmitted={isSubmitted}
          placeholder="Name..."
          ref={nameRef}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email?.message}
          isSubmitted={isSubmitted}
          placeholder="Email..."
        />
        <Input
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password?.message}
          isSubmitted={isSubmitted}
          placeholder="Password..."
        />
        <SelectInput
          label="Role"
          name="role"
          register={register}
          error={errors.role?.message}
          isSubmitted={isSubmitted}
        >
            <option disabled value={""}>
              select role
            </option>
            <option value={"2001"}>user</option>
            <option value={"1995"}>admin</option>
            <option value={"1999"}>Product Manager</option>
        </SelectInput>
        <Button type="submit" loading={loading} loadingText="create user">
          create user
        </Button>
        <div className="input-desc">
          {emailError !== "" && <span className="error">{emailError}</span>}
        </div>
      </Form>
    </>
  );
};

export default CreateUser;
