import { mainSearch, searchBoxResult } from "../Components/HomeComponents.js";

export const UIController = (function () {
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
      result.albums.items.forEach((item) => {
        html = `
          <div>
              <img src="${item.images[2].url}" alt="Album cover">
              <p>${item.name}</p>
          </div>
          `;
        displayResultDiv.insertAdjacentHTML("beforeend", html);
      });

      result.artists.items.forEach((item) => {
        html = `
            <div>
                <img src="${item.images[2].url}" alt="Artist's image">
                <p>${item.name}</p>
            </div>
          `;
        displayResultDiv.insertAdjacentHTML("beforeend", html);
      });
    }
  };

  const _unloadHome = () => {
    let main = document.getElementById("main-site");
    main.innerHTML = "";
    main.insertAdjacentHTML("beforeend", mainSearch);
    main.insertAdjacentHTML("beforeend", searchBoxResult);
  };

  return {
    displayTracks(tracks, img) {
      return _displayTracks(tracks, img);
    },
    displaySearch(result) {
      return _displaySearch(result);
    },
    unloadHome() {
      return _unloadHome();
    },
  };
})();
