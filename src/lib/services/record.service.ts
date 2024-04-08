import axios from "axios";

const getRecord = () =>
  axios.get("https://api.airtable.com/v0/appLSYOnRTwIqy1gC/Table%201", {
    headers: {
      Authorization:
        "Bearer pattttdC6L6fYDbv5.29a1d7ac22c0668d790c3a8972f7257006ad54f22c90344cde613bc35a684372",
    },
  });

export { getRecord };
