const isProd = process.env.NODE_ENV === "production";

const DEV_URL = "https://todopang.uk/admin";
const PROD_URL = "http://localhost:18540/admin";

const SERVER_URL = isProd ? PROD_URL : DEV_URL;

export default { SERVER_URL, isProd };
