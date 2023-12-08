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
      let headerAlbums = `
      <div class="header">
        <h1>Albums</h1>
        <div class="line"></div>
      </div>
      `;
      displayResultDiv.insertAdjacentHTML("beforeend", headerAlbums);
      console.log(result);
      for (let item of result.albums.items) {
        let singersArr = [];
        item.artists.forEach((artist) => {
          singersArr.push(artist.name);
        });
        let singers = singersArr.toString();
        let picture = item.images.find((el) => el.width == 300);
        if (picture == undefined) continue;
        let year = item.release_date.slice(0, 4);
        html = `
          <div class="item-box-albums">
              <img src="${picture.url}" alt="Album cover">
              <div class="info">
                <div>
                 <p title="${item.name}">${item.name}</p>
                 <p>(${year})</p>
                </div>
               <p class="artists-names" title="${singers}">${singers}</p>
              </div>
              <i class="bi bi-plus-circle album" id="${item.id}"></i>
          </div>
          `;
        displayResultDiv.insertAdjacentHTML("beforeend", html);
      }
      let headerArtist = `
      <div class="header">
        <h1>Artists</h1>
        <div class="line"></div>
      </div>
      `;
      displayResultDiv.insertAdjacentHTML("beforeend", headerArtist);

      for (let item of result.artists.items) {
        let picture = item.images.find(
          (el) => el.width == 300 || el.width == 320
        );
        if (picture == undefined) continue;
        html = `
            <div  class="item-box-artists">
                <img src="${picture.url}" alt="Artist's image">
                <p>${item.name}</p>
                <div>
                  <i class="bi bi-plus-circle artist" id="${item.id}"></i>
                </div>
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

  const _displaySavedAlbums = () => {
    let html;
    let displayResultDiv = document.getElementById("albums-list");
    if (localStorage.getItem("albums")) {
      let albums = JSON.parse(localStorage.getItem("albums"));
      for (let album of albums) {
        let singers = [];
        album.artists.forEach((artist) => {
          singers.push(artist.name);
        });
        let picture = album.images.find((el) => el.width == 300);
        if (picture == undefined) continue;
        let year = album.release_date.slice(0, 4);
        html = `
          <div class="item-box">
              <img src="${picture.url}" alt="Album cover">
              <div class="info">
                <div>
                 <p>${album.name}</p>
                 <p>(${year})</p>
                </div>
               <p class="artists-names">${singers.toString()}</p>
              </div>
             
          </div>
          `;
        displayResultDiv.insertAdjacentHTML("beforeend", html);
      }
    } else {
      html = `<h1 class="no-result">No albums saved</h1>`;
      displayResultDiv.insertAdjacentHTML("beforeend", html);
    }
  };

  const _displaySavedArtists = () => {
    let html;
    let displayResultDiv = document.getElementById("artists-list");
    if (localStorage.getItem("artists")) {
      let artists = JSON.parse(localStorage.getItem("artists"));
      for (let artist of artists) {
        let picture = artist.images.find(
          (el) => el.width == 300 || el.width == 320
        );
        if (picture == undefined) continue;
        html = `
          <div class="item-box">
              <img src="${picture.url}" alt="Album cover">
              <p>${artist.name}</p>
          </div>
          `;
        displayResultDiv.insertAdjacentHTML("beforeend", html);
      }
    } else {
      html = `<h1 class="no-result">No albums saved</h1>`;
      displayResultDiv.insertAdjacentHTML("beforeend", html);
    }
  };

  const _unloadHome = () => {
    let main = document.getElementById("main-section");
    main.innerHTML = "";
    main.insertAdjacentHTML("beforeend", mainSearch);
    main.insertAdjacentHTML("beforeend", searchBoxResult);
    document.getElementById("main-form").addEventListener("submit", (e) => {
      e.preventDefault();
      let input = document.getElementById("main-search-input");
      App.sendSearch(input.value, true);
    });
  };

  const _loadHome = () => {
    let main = document.getElementById("main-section");
    main.innerHTML = "";
    main.insertAdjacentHTML("beforeend", albums);
    main.insertAdjacentHTML("beforeend", tracks);
  };

  const _refreshSearch = () => {
    document.getElementById("search-box-result").innerHTML = "";
  };

  const _loadAlbumsCarrousel = () => {
    let html;
    let carrouselDiv = document.getElementById("albums-carrousel");
    if (localStorage.getItem("albums")) {
      let albums = JSON.parse(localStorage.getItem("albums"));
      let nodeId = 0;
      for (let album of albums) {
        let picture = album.images.find((el) => el.width == 300);
        if (picture == undefined) continue;
        html = `
        <div class="album-item hidden" id="${nodeId}">
          <img src="${picture.url}" id="${album.id}" alt="${album.name}">
          <h2>${album.name}</h2>
        </div>
        `;
        carrouselDiv.insertAdjacentHTML("beforeend", html);
        nodeId++;
      }
      let elements = document.querySelectorAll(".hidden");
      let middle = Math.floor(elements.length / 2);

      elements[middle].classList.add("focused-album");

      for (let i = middle - 2; i <= middle + 2; i++) {
        elements[i].classList.remove("hidden");
        elements[i].classList.add("displayed");
        if (i == middle) continue;
        if (i == middle - 1 || i == middle + 1) {
          elements[i].classList.add("next-album");
        } else {
          elements[i].classList.add("last-album");
        }
      }
    }
  };

  return {
    displayTracks(tracks, img) {
      return _displayTracks(tracks, img);
    },
    displaySearch(result) {
      return _displaySearch(result);
    },
    displaySavedAlbums() {
      return _displaySavedAlbums();
    },
    displaySavedArtists() {
      return _displaySavedArtists();
    },
    unloadHome() {
      return _unloadHome();
    },
    loadHome() {
      return _loadHome();
    },
    refreshSearch() {
      return _refreshSearch();
    },
    loadAlbumsCarrousel() {
      return _loadAlbumsCarrousel();
    },
  };
})();
