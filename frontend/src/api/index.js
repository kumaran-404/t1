import axios from "axios";

const baseURL = "http://localhost:3000/";

const URLS = {
  LOGIN: "/api/auth/login/",
  SIGNUP: "/api/auth/signup/",
  VERIFY_JWT: "/api/auth/verifyJWT/",
  DISCUSSION: "/api/discussion/",
  COMMENT: "/api/comment/",
};

export const axiosObj = axios.create({
  baseURL,
});

axiosObj.interceptors.request.use(
  function (config) {
    config.headers.Authorization = "Bearer " + localStorage.getItem("token");
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const signup = async (data) => {
  try {
    const resp = await axiosObj.post(URLS.SIGNUP, data);

    return resp.data;
  } catch (err) {
    return null;
  }
};

export const login = async (data) => {
  try {
    const resp = await axiosObj.post(URLS.LOGIN, data);

    return resp.data;
  } catch (err) {
    return null;
  }
};

export const verifyJWT = async () => {
  try {
    const resp = await axiosObj.post(URLS.VERIFY_JWT);

    return resp.data;
  } catch (err) {
    return null;
  }
};

export const createDiscussion = async (data) => {
  try {
    console.log(data);
    const resp = await axiosObj.post(URLS.DISCUSSION, data);

    return resp.data;
  } catch (err) {
    return null;
  }
};

export const fetchAllDiscussion = async () => {
  try {
    const resp = await axiosObj.get(URLS.DISCUSSION + "1/5/");
    return resp.data.data;
  } catch (err) {
    return null;
  }
};

export const fetchDiscussion = async (id) => {
  try {
    console.log("id", id);
    const resp = await axiosObj.get(URLS.DISCUSSION + id);
    return resp.data.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const likeDiscussion = () => {};

export const deleteDiscussion = async (id) => {
  try {
    const resp = await axiosObj.delete(URLS.DISCUSSION + id);

    return resp.data.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

////////////////// comment
export const fetchComment = async (id) => {
  try {
    console.log("id", id);
    const resp = await axiosObj.get(URLS.COMMENT + id);
    return resp.data.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const postComment = async (id, comment) => {
  try {
    console.log("id", id);
    const resp = await axiosObj.post(URLS.COMMENT, {
      DiscussionId: id,
      content: comment,
    });
    return resp.data.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const deleteComment = async (id) => {
  try {
    console.log("id", id);
    const resp = await axiosObj.delete(URLS.COMMENT + id);
    return resp.data.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const replyToComment = () => {};
