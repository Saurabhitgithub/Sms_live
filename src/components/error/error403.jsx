import React from "react";
import { Button } from "../Component";
import Content from "../../layout/content/Content";
import { useHistory } from "react-router-dom";
import style from "./style.module.css";

const Error403 = () => {
  const history = useHistory();
  return (
    <Content>
      <div className="h-100" style={{ backgroundColor: "white" }}>
        <div className={`${style.img_container}`}></div>
        <div className={`d-flex flex-column align-items-center pb-5 ${style.image_container_child}`}>
          <p style={{ fontSize: "40px", color: "#0E1073", fontWeight: 700 }}>We are sorry...</p>
          <p style={{ color: "#9699A7", fontWeight: 500 }}>The page you’re trying to access has restricted ascess.</p>
          <p style={{ color: "#9699A7", fontWeight: 500 }}>Please refer to your system administrator</p>
          <Button
            color="primary"
            size="lg"
            className="mt-2"
            onClick={() => {
              localStorage.clear();
              history.push("/auth-login");
            }}
          >
            Back To Login
          </Button>
        </div>
      </div>
    </Content>
  );
};
export default Error403;
