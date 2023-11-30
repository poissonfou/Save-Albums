"strict mode";
export const APIController = (function () {
  const clientId = "db26ec33a3ea42658911c658210d3e7f";
  const clientSecret = "1a0e3650380c48cbbc871f4ab2b5ceff";

  const _getToken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });
    const data = await result.json();
    return data.access.token;
  };

  const _getAlbum = async (id, token) => {
    const result = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
      Authorization: "Bearer " + token,
    });
    const data = await result.json();
    return data;
  };

  const _getAlbumTracks = async (id, token) => {
    const result = await fetch(`//api.spotify.com/v1/albums/${id}/tracks`, {
      Authorization: "Bearer " + token,
    });
    const data = await result.json();
    return data.items;
  };

  const _search = async (q, type = "album, artist") => {
    const result = await fetch(
      `https://api.spotify.com/v1/search?${q}&${type}`,
      {
        Authorization: "Bearer " + token,
      }
    );
    const data = await result.json();
    return data;
  };

  const _getArtist = async (id) => {
    const result = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
      Authorization: "Bearer " + token,
    });
    const data = await result.json();
    return data;
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
    search(q) {
      return _search(q);
    },
    getArtist(id) {
      return _getArtist(id);
    },
  };
})();
