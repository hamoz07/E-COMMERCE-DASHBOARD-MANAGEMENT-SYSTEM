import axios from "axios";
import React, { useEffect } from "react";
import { GOOGLE_CALL_BACK, baseURL } from "../../Api/api";
import { useLocation } from "react-router-dom";
import Cookie from "cookie-universal";

const GOOGLECALLBACK = () => {
  const loc = useLocation();
  const cookie = Cookie();

  useEffect(() => {
    async function runCallBack() {
      try {
        const res = await axios.get(
          `${baseURL}/${GOOGLE_CALL_BACK}${loc.search}`
        );
        const token = res.data.access_token;
        cookie.set("user-token", token);
      } catch (error) {
        error;
      }
    }
    runCallBack();
  }, []);

  return <div>test</div>;
};

export default GOOGLECALLBACK;
