/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
// import { REGISTERREQ, baseURL } from "../../../api/endpoints.js";
import LoadingPage from "../../../components/feedback/LoadingPage.jsx";
// rrd
import { useNavigate, useParams } from "react-router-dom";
//  libraries
import { Form } from "react-bootstrap";
import { AX } from "../../../api/client.js";
import { ONEUSERREQ } from "../../../api/endpoints.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editUserSchema } from "../../../validations/editUserSchema";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import Input from "../../../components/forms/Input";
import SelectInput from "../../../components/forms/SelectInput";
import Button from "../../../components/ui/Button/Button.jsx";
import { useAppDispatch } from "../../../store/hooks";
import { addToast } from "../../../store/toasts/toastSlice";

const EditUser = () => {
  
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  let {id} = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(editUserSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", role: "" },
  });

  const nameRef = useRef();


  useEffect(()=>{
    nameRef.current.focus()
  },[])
  

  useEffect(() => {
    setLoading(true)
    const res = AX.get(`${ONEUSERREQ}/${id}`).then((res) => {
      reset({
        email: res.data.email,
        name: res.data.name,
        role: res.data.role,
      });
    setLoading(false)
    }).catch(err => nav("/dashboard/users/page/404",{replace:true}))
  }, [id, nav, reset]);

  const submitForm = async (formData) => {
    setLoading(true);

    try {
      const response = await AX.post(`/${ONEUSERREQ}/edit/${id}`, formData);
      setEmailError("");
      dispatch(
        addToast({
          title: "User updated",
          type: "success",
          message: "The user was updated successfully.",
        }),
      );
      nav("/dashboard/users");
    } catch (error) {
      const message =
        axiosErrorHandler(error) || "Unable to update user.";
      setEmailError(message);
      dispatch(
        addToast({
          title: "Unable to update user",
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
        <Button type="submit" loading={loading} loadingText="save">
          save
        </Button>
        <div className="input-desc">
          {emailError !== "" && <span className="error">{emailError}</span>}
        </div>
      </Form>
    </>
  );
};

export default EditUser;
