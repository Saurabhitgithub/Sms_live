import React, { useEffect } from "react";
import style from "./style.module.css";
import { IoClose } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { error, info, success } from "../../Store/Slices/SnackbarSlice";
import { FaCheckCircle } from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

export default function Snackbar({ children }) {
  const data = useSelector(e => e.snackbar);
  const dispatch = useDispatch();
  let closeTime = 20000;
 
  const close = () => {
    if (data.severity === "success") {
      dispatch(success({ show: false, detail: "" }));
    } else if (data.severity === "error") {
      dispatch(error({ show: false, detail: "" }));
    } else {
      dispatch(info({ show: false, detail: "" }));
    }
  };

  const show = () => {
    if (data.show) {
      setTimeout(() => {
        close();
      }, 4000);
    }
  };

  const history = useHistory();
  const redirect = () => {
    if (data.redirectLink) {
      
        window.location.href = data.redirectLink;
      close(); // Close snackbar after redirect
    }
  };


  useEffect(() => {
    show(data);
  }, [data, closeTime]);

  function checktype(type) {
    switch (type) {
      case "success":
        return <FaCheckCircle className="f-18 mr-2" />;
        break;
      case "error":
        return <MdInfoOutline className="f-18 mr-2" />;
        break;
      case "info":
        return <MdInfoOutline className="f-18 mr-2" />;
        break;

      default:
        return <FaCheckCircle className="f-18 mr-2" />;
        break;
    }
  }
  function checktype2(type) {
    switch (type) {
      case "success":
        return style.green;
        break;
      case "error":
        return style.red;
        break;
      case "info":
        return style.yellow;
        break;

      default:
        return style.green;
        break;
    }
  }
  function iconType(type) {
    switch (type) {
      case "success":
        return "#ffffff";
        break;
      case "error":
        return "#5C687A";
        break;
      case "info":
        return "#ffffff";
        break;

      default:
        return "#ffffff";
        break;
    }
  }

  return (
    <>
      <div className={style.mainContainer}>
        {data.show ? (
          <div className={`${style.snackbar} ${checktype2(data?.severity)}`}>
            <div
              className={`${style.content}`}
              onClick={redirect}
              style={{ cursor: data.redirectLink ? "pointer" : "default" }}
            >
              {checktype(data?.severity)} {data?.detail}
            </div>
            <div className={`${style.closeIcon}`}>
              <IoClose className="f-18" color={iconType(data?.severity)} onClick={close} />
            </div>
          </div>
        ) : (
          ""
        )}
        {children}
      </div>
    </>
  );
}

// export function useSnackbar(option){
//     if(option == undefined){

//         return {
//             position: 'top-center',
//             type:'success',
//             message:'Added Successfully teshgjhghgjh hhjh jkhjkh jjh'
//         }

//     }else{
//         return{
//             position: 'top-center',
//             type:'success',
//             message:'Added Successfully teshgjhghgjh hhjh jkhjkh jjh 4525'
//         }

//     }
//     return 'hello snackbar'

// }
