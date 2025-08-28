import { jwtDecode } from "jwt-decode";
import { getPermissionByRole } from "../service/admin";
let decodeValue = {};

function decodeData() {
  try {
    let token = localStorage.getItem("accessToken");

    if (token) {
      const decoded = jwtDecode(token);
      return decoded;
    }
  } catch (err) {
    // localStorage.removeItem("accessToken");
    // window.location.reload();
    console.log(err);
  }
}
async function permissionTabs() {
  let token = localStorage.getItem("accessToken");

  if (token) {
    let roleData = await getPermissionByRole({ role: decodeData().role, id: decodeData()._id });
    return roleData?.data?.data?.permission_tab ? roleData?.data?.data?.permission_tab : [];
  } else {
    return [];
  }
}

export function userInfo() {
  return decodeData();
}
export function userId() {
  return decodeData()?._id;
}
export async function permisionsTab() {
  return await permissionTabs();
}

export function permisionsTabJwt() {
  return decodeData()?.permission;
}
