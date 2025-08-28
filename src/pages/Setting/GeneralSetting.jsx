import React, { useEffect, useRef, useState } from "react";
import Content from "../../layout/content/Content";
import Style from "./Setting.module.css";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import colorimg from "./../../images/wheel-5-ryb 1.png";
import { addAndUpdateSetting, getLogoSetting, uploadDocument } from "../../service/admin";
import { permisionsTab, userInfo } from "../../assets/userLoginInfo";
import { updateGeneralSettings } from "../../Store/Slices/GenralSettingsSlice";
import { IoShareOutline } from "react-icons/io5";
import Loader from "../../components/commonComponent/loader/Loader";
import Error403 from "../../components/error/error403";

function GeneralSetting() {
  const [formData, setFormData] = useState({
    logo: "",
    color: "",
    lighterColor: "",
    id: "",
    deleted_file: [],
  });
  const dispatch = useDispatch();
  const [themeColor, setThemeColor] = useState("");
  const [lighterColor, setLighterColor] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [loader, setLoader] = useState(true);
  const [preFile, setPreFiles] = useState();
  const [selectedFileURL, setSelectedFileURL] = useState(null); // Add this line
  const fileInputRef = useRef(null);
  const colorInputRef = useRef(null);
  let userId = userInfo()?._id;
  const [fileError, setFileError] = useState("");
  const [settingPermission, setSettingPermission] = useState([]);
  const [permissionAccess, setPermissionAccess] = useState(true);
  async function permissionFunction() {
    const res = await permisionsTab();
    

    const permissions = res.filter((s) => s.tab_name === "Settings");
    if (permissions.length !== 0) {
      setPermissionAccess(permissions[0]?.is_show);
      let permissionArr = permissions[0]?.tab_function
        ?.filter((s) => s.is_showFunction === true)
        .map((e) => e.tab_functionName);
        setSettingPermission(permissionArr);
    }
  }
  useEffect(() => {

    getpreviousData();
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleButtonColor = () => {
    colorInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setSelectedFileURL(URL.createObjectURL(file));
    // validateFileDimensions(file);
  };

  // const validateFileDimensions = (file) => {
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = function (e) {
  //     const img = new Image();
  //     img.onload = function () {
  //       const minWidth = 150;
  //       const maxWidth = 200;
  //       const minHeight = 25;
  //       const maxHeight = 50;

  //       if (img.width < minWidth || img.width > maxWidth || img.height < minHeight || img.height > maxHeight) {
  //         setFileError(`Please select an image with dimensions between min size ${minWidth}x${minHeight} pixels and max size ${maxWidth}x${maxHeight} pixels.`);
  //         setSelectedFile(null);
  //       } else {
  //         setFileError('');
  //       }
  //     };
  //     img.src = e.target.result;
  //   };
  //   reader.readAsDataURL(file);
  // };
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b];
  };

  const lightenColor = (color, opacity) => {
    const [r, g, b] = hexToRgb(color);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const handleColorChange = (event) => {
    const newColor = event.target.value;
    const lighterColor = lightenColor(newColor, 0.3); // 30% opacity

    setThemeColor(newColor);
    setLighterColor(lighterColor);
    setSelectedColor(newColor);

    document.documentElement.style.setProperty("--primaryColor", newColor);
    document.documentElement.style.setProperty("--primaryColorLight", lighterColor);

    setFormData({
      ...formData,
      color: newColor,
      lightcolor: lighterColor,
    });
  };

  const HandleSubmit = async () => {
    setLoader(true);
    try {
      let updatedFormData = {
        color: themeColor || preFile?.color,
        lighterColor: lighterColor || preFile?.lighterColor,
        // logo: preFile?.logo?.file_url,
        deleted_file: [preFile?.file_name],
        id: preFile?._id,
      };

      if (selectedFile) {
        let fileForm = new FormData();
        fileForm.append("upload", selectedFile);
        let uploadResponse = await uploadDocument(fileForm);

        if (uploadResponse && uploadResponse.data && uploadResponse.data.data[0]) {
          const newFileData = uploadResponse.data.data[0];
          updatedFormData.logo = newFileData;
          updatedFormData.deleted_file = [preFile?.logo?.file_name];
        }
      }

      let dataLogo = await addAndUpdateSetting(updatedFormData);
      
      getpreviousData();
    } catch (error) {
      
    }
    setLoader(false);
  };

  const getpreviousData = async () => {
    setLoader(true)
    try {
      await permissionFunction();
      let predata = await getLogoSetting();
      setPreFiles(predata.data.data);
      dispatch(updateGeneralSettings({ logo: predata.data.data.logo.file_url }));
      setThemeColor(predata.data.data.color);
      setLighterColor(predata.data.data.lighterColor);
      setFormData(predata.data.data);

    } catch (error) {
      
    }
    setLoader(false)

  };

  return (
    <>
      <Content>
        {loader ? (
          <Loader />
        ) : (
          <>
     
            {permissionAccess && settingPermission.includes("General Setting Tab") ? (
              <>
                {" "}
                <div className={Style.General_Setting}>
                  <h1>General Settings</h1>
                  <div className="row">
                    <div className="col-md-6">
                      <p className={Style.SiteLogoText}>Logo : - Size 152x28</p>
                      <div className={Style.LogoCustom}>
                        <input type="file" id="fileInput" hidden ref={fileInputRef} onChange={handleFileChange} />
                        {/* {!selectedFileURL && preFile?.logo?.file_url && <img src={preFile.logo.file_url} alt="Previous logo" className="py-2" style={{ width: '70px', height: '70px' }} />} Add this line */}
                        {selectedFile ? (
                          <p className={`py-2 text-center ${Style.selectedColortext}`}>
                            Selected file: {selectedFile.name}
                          </p>
                        ) : (
                          <p className={`py-2 text-center ${Style.selectedColortext}`}>
                            Selected file: {preFile?.logo?.file_name}
                          </p>
                        )}
                        <button className={Style.btn_color} onClick={handleButtonClick}>
                          {" "}
                          <IoShareOutline className="mb-1" /> Upload File
                        </button>
                        {fileError && <p className={Style.errorText}>{fileError}</p>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <p className={Style.SiteLogoText}>Theme Color</p>
                      <div className={Style.LogoCustom}>
                        <p className={`mb-3 ${Style.selectedColortext}`}>
                          Selected color:{" "}
                          <span style={{ color: selectedColor || preFile?.color }}>
                            {selectedColor || preFile?.color}
                          </span>
                        </p>
                        {/* <img src={colorimg} onClick={handleButtonColor} alt="" /> */}
                        <input
                          className={Style.InputColor}
                          type="color"
                          id="colorInput"
                          ref={colorInputRef}
                          // value={selectedColor || preFile?.color || ''}
                          onChange={handleColorChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-5">
                    <Button className={`btn btn-primary`} onClick={()=>HandleSubmit()}>
                      Submit
                    </Button>
                  </div>
                </div>
              </>
            ):(<Error403/>)}
          </>
        )}
      </Content>
    </>
  );
}

export default GeneralSetting;
