"strict mode";

const APIController = (function () {
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
    return data.access_token;
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

  const _search = async (q, token, type = "album artist") => {
    const result = await fetch(
      `https://api.spotify.com/v1/search?${q}&${type}`,
      {
        Authorization: `Bearer ${token}`,
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
    search(q, token) {
      return _search(q, token);
    },
    getArtist(id) {
      return _getArtist(id);
    },
  };
})();

const UIController = (function () {
  const _displayTracks = (tracks, img) => {
    let tracksDiv = document.querySelectorAll("#tracks");
    let html;
    tracks.forEach((x) => {
      html = `
                <div>
                    <img src="${img[0].url}" alt="Album cover">
                    <p>${x.name}</p>
                </div>
            `;
      tracksDiv.appendChild(html);
    });
  };

  const _displaySearch = (result) => {
    let html;
    let displayResultDiv = document.getElementById("search-box-result");

    if (!result.albums.items && result.artists.items) {
      html = `<h1>No result found</h1>`;
    } else {
      result.albums.items.forEach((x) => {
        html = `
        <div>
            <img src="${x[0].images[0].url}" alt="Album cover">
            <p>${x[0].name}</p>
        </div>
        `;
        displayResultDiv.appendChild(html);
      });

      result.artists.items.forEach((x) => {
        html = `
          <div>
              <img src="${x[0].images[0].url}" alt="Album cover">
              <p>${x[0].name}</p>
          </div>
        `;
        displayResultDiv.appendChild(html);
      });
    }
  };

  return {
    displayTracks(tracks, img) {
      return _displayTracks(tracks, img);
    },
    displaySearch(result) {
      return _displaySearch(result);
    },
  };
})();

const App = (function (UIController, APIController) {
  const _sendSearch = (input) => {
    let token = APIController.getToken();
    let result = APIController.search(input, token);
    window.location.href = "search.html";
    UIController.displaySearch(result);
  };

  return {
    sendSearch(input) {
      return _sendSearch(input);
    },
  };
})(UIController, APIController);

window.onload = function () {
  let form = document.getElementById("search-form");
  let input = document.getElementById("search-input");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    App.sendSearch(input.value);
  });
};
