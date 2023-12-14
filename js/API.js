export const APIController = (function () {
  const clientId = "db26ec33a3ea42658911c658210d3e7f";
  const clientSecret = "1a0e3650380c48cbbc871f4ab2b5ceff";

  const _getToken = async () => {
    try {
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
    } catch (error) {
      console.log(error);
      alert("An error has occurred on token requisition. Try again.");
    }
  };

  const _getAlbum = async (id, token) => {
    try {
      const result = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await result.json();
      return data;
    } catch (error) {
      console.log(error);
      alert("An error has occurred on album fetching. Try again.");
    }
  };

  const _getAlbumTracks = async (id, token) => {
    try {
      const result = await fetch(
        `https://api.spotify.com/v1/albums/${id}/tracks`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await result.json();
      return data.items;
    } catch (error) {
      console.log(error);
      alert("An error has occurred on track fetching. Try again.");
    }
  };

  const _search = async (q, token, type = ["album", "artist"]) => {
    try {
      const result = await fetch(
        `https://api.spotify.com/v1/search?q=${q}&type=${type}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await result.json();
      return data;
    } catch (error) {
      console.log(error);
      alert("An error has occurred on searching. Try again.");
    }
  };

  const _getArtist = async (id, token) => {
    try {
      const result = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await result.json();
      return data;
    } catch (error) {
      console.log(error);
      alert("An error has occurred on artist fetching. Try again.");
    }
  };

  return {
    getToken() {
      return _getToken();
    },
    getAlbum(id, token) {
      return _getAlbum(id, token);
    },
    getAlbumTracks(id, token) {
      return _getAlbumTracks(id, token);
    },
    search(q, token) {
      return _search(q, token);
    },
    getArtist(id, token) {
      return _getArtist(id, token);
    },
  };
})();
