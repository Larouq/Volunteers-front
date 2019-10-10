import axios from "axios";
import config from "../config";

const BACKEND_API_URL = "http://localhost:3000";

export async function submitRegistration(form) {
  const { email, password, firstName, lastName, image } = form;
  try {
    const params = {
      email,
      password,
      name: lastName,
      nickname: firstName,
      image
    };
    const results = await axios.post(`${BACKEND_API_URL}/auth`, params);
    localStorage.setItem(
      "authentication_token",
      results.headers["access-token"]
    );
    localStorage.setItem("email", email);
    localStorage.setItem("name", firstName);
    localStorage.setItem("user_id", results.data.data["id"]);
    localStorage.setItem("client", results.headers["client"]);
    return results;
  } catch (error) {
    alert(new Error("registration failed please change password or email."));
  }
}

export async function submitAuthentification(form) {
  const { email, password } = form;
  try {
    const params = {
      email,
      password
    };
    const results = await axios.post(`${BACKEND_API_URL}/auth/sign_in`, params);
    localStorage.setItem(
      "authentication_token",
      results.headers["access-token"]
    );
    localStorage.setItem("email", email);
    localStorage.setItem("user_id", results.data.data["id"]);
    localStorage.setItem("client", results.headers["client"]);
    localStorage.setItem("name", results.data.data["nickname"]);
    return results;
  } catch (error) {
    return error.response;
  }
}

export async function fetchRequests(access_token, client, uid, userId) {
  try {
    const results = await axios.get(
      `${BACKEND_API_URL}/requests`,
      {
        params: {
          user_id: userId
        }
      },
      {
        headers: {
          "access-token": access_token,
          client: client,
          uid: uid
        }
      }
    );
    return results.data;
  } catch (error) {
    alert(new Error("backend API request failed"));
  }
}

export async function submitRequest(access_token, client, uid, form) {
  const { title, address, description, user_id, category, name } = form;
  const lng = form.geoObject.Point.pos.split(" ")[0];
  const lat = form.geoObject.Point.pos.split(" ")[1];

  try {
    const params = {
      title,
      description,
      address,
      lat,
      lng,
      user_id,
      category,
      user_name: name
    };
    const result = await axios.post(`${BACKEND_API_URL}/requests`, params, {
      headers: {
        "access-token": access_token,
        client: client,
        uid: uid
      }
    });
    return result;
  } catch (error) {
    return error.response;
  }
}

export async function getAddress(city) {
  try {
    const result = await axios.get(
      `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${config.YANDEX_API}&geocode=${city}&lang=en-US`
    );
    return result;
  } catch (error) {
    return error.response;
  }
}

export async function sendEmail(from, to, message) {
  const params = {
    from_user: from,
    user_id: to,
    TextPart: message
  };
  return axios.post(`${BACKEND_API_URL}/sendemail`, params);
}

export async function createMessage(requestID, userId, content) {
  try {
    const params = {
      user_id: userId,
      content
    };
    return axios.post(
      `${BACKEND_API_URL}/requests/${requestID}/messages`,
      params
    );
  } catch (error) {
    return error.response;
  }
}

export async function deleteRequest(requestId) {
  try {
    const params = {
      statement: 1
    };
    const result = await axios.put(
      `${BACKEND_API_URL}/requests/${requestId}`,
      params
    );
    return result;
  } catch (error) {
    return error.response;
  }
}

export async function republishRequest(requestId) {
  try {
    const params = {
      status: 0
    };
    const result = await axios.put(
      `${BACKEND_API_URL}/requests/${requestId}`,
      params
    );
    return result;
  } catch (error) {
    return error.response;
  }
}

export default {
  submitRegistration,
  submitAuthentification,
  fetchRequests,
  submitRequest,
  getAddress,
  sendEmail,
  createMessage,
  deleteRequest,
  republishRequest
};
