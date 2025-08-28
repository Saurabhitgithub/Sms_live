import React, { useEffect, useState } from "react";
import smsLogo from '../../images/smsLogo.png'
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getLogoSetting } from "../../service/admin";
import { updateGeneralSettings } from "../../Store/Slices/GenralSettingsSlice";

const Logo = () => {
  const logoData = useSelector((e) => e.generalSettingsData);

  const dispatch = useDispatch();
  let closeTime = 20000;
  const [data,setData]=useState()
  const handlegetLogo = async () => {
    try {
      let data = await getLogoSetting()
   
      setData(data.data.data.logo)
      dispatch(updateGeneralSettings({logo:data.data.data.logo.file_url}))
    } catch (error) {
      

    }
  }
  useEffect(() => {
    handlegetLogo()
  }, [])
  return (
    <Link to={`${process.env.PUBLIC_URL}/dashboard`} className="logo-link">
      <img className="logo-light logo-img" src={logoData?.logo} alt="logo" />
      <img className="logo-dark logo-img" src={logoData?.logo} alt="logo" />
    </Link>
  );
};

export default Logo;
