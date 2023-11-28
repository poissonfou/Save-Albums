const clientId = "db26ec33a3ea42658911c658210d3e7f";
const clientSecret = "1a0e3650380c48cbbc871f4ab2b5ceff";

const getToken = async () => {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
    },
    body: "grant_type=client_credentials",
  });

  const data = await result.json();
  return data.access_token;
};

let token = getToken();

token = setTimeout(getToken, 3.6e6);
