export default function({ $axios }, inject) {
  // Create a custom axios instance
  const api = $axios.create({
    baseURL: `${process.env.BASE_URL}/projectfoodfast/us-central1/`,
    headers: {
      "Content-Type": "application/json"
    }
  });

  // Inject to context as $api
  inject("api", api);
}
