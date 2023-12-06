import { mainSearch, searchBoxResult } from "../Components/SearchComponents.js";
import { albums, tracks } from "../Components/HomeComponents.js";
import { App } from "./App.js";

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

    if (!result.albums.items.length && !result.artists.items.length) {
      html = `<h1 class="no-result">No result found</h1>`;
      displayResultDiv.insertAdjacentHTML("beforeend", html);
    } else {
      console.log(result);
      for (let item of result.albums.items) {
        let picture = item.images.find((el) => el.width == 300);
        if (picture == undefined) continue;
        html = `
          <div class="item-box">
              <img src="${picture.url}" alt="Album cover">
              <p>${item.name}</p>
              <i class="bi bi-plus-circle album" id="${item.id}"></i>
          </div>
          `;
        displayResultDiv.insertAdjacentHTML("beforeend", html);
      }

      for (let item of result.artists.items) {
        let picture = item.images.find(
          (el) => el.width == 300 || el.width == 320
        );
        if (picture == undefined) continue;
        html = `
            <div  class="item-box">
                <img src="${picture.url}" alt="Artist's image">
                <p class="name">${item.name}</p>
                <i class="bi bi-plus-circle artist" id="${item.id}"></i>
            </div>
          `;
        displayResultDiv.insertAdjacentHTML("beforeend", html);
      }
      document.querySelectorAll(".bi").forEach((el) => {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          let isAlbum = e.target.classList[2] == "album";
          App.getItems(e.target.id, isAlbum);
        });
      });
    }
  };

  const _unloadHome = () => {
    let main = document.getElementById("main-section");
    main.innerHTML = "";
    main.insertAdjacentHTML("beforeend", mainSearch);
    main.insertAdjacentHTML("beforeend", searchBoxResult);
  };

  const _loadHome = () => {
    let main = document.getElementById("main-section");
    main.innerHTML = "";
    main.insertAdjacentHTML("beforeend", albums);
    main.insertAdjacentHTML("beforeend", tracks);
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
    loadHome() {
      return _loadHome();
    },
  };
})();
