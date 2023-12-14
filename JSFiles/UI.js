import { mainSearch, searchBoxResult } from "../Components/SearchComponents.js";
import { App } from "./App.js";

export const UIController = (function () {
  const _displaySearch = (result) => {
    let html;
    let displayResultDiv = document.getElementById("search-box-result");
    displayResultDiv.innerHTML = "";

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
                <p title="${item.name}">${item.name}</p>
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
    let idx = 0;
    if (localStorage.getItem("albums")) {
      let albums = JSON.parse(localStorage.getItem("albums"));
      for (let album of albums) {
        let singersArr = [];
        album.artists.forEach((artist) => {
          singersArr.push(artist.name);
        });
        let singers = singersArr.toString();
        let picture = album.images.find((el) => el.width == 300);
        if (picture == undefined) continue;
        let year = album.release_date.slice(0, 4);
        html = `
          <div class="item-box">
              <img src="${picture.url}" alt="Album cover">
              <div class="info">
                <div>
                 <p title="${album.name}">${album.name}</p>
                 <p>(${year})</p>
                </div>
               <p class="artists-names" title="${singers}">${singers}</p>
              </div>
             <div class="redirect">
               <div class="button-home">
                 <button class="${album.id} ${picture.url}" id="${idx}">Go to album</button>
               </div>
               <div class="spotify-link">
                <h4>Listen on</h4>
                <i class="bi bi-spotify" id=${album.external_urls.spotify}></i>
               </div>
             </div>
          </div>
          `;
        displayResultDiv.insertAdjacentHTML("beforeend", html);
        idx++;
      }

      document.querySelectorAll(".bi-spotify").forEach((el) => {
        el.addEventListener("click", (e) => {
          window.location.assign(e.target.id);
        });
      });

      document.querySelectorAll("button").forEach((el) => {
        el.addEventListener("click", (e) => {
          localStorage.setItem(
            "redirect",
            JSON.stringify({
              idx: e.target.id,
            })
          );
          window.location.href = "home.html";
        });
      });
    } else {
      html = `<h1 class="no-result">No albums saved</h1>`;
      displayResultDiv.insertAdjacentHTML("beforeend", html);
    }
  };

  const _displaySavedArtists = () => {
    let html;
    let albumsDiv;
    let displayResultDiv = document.getElementById("artists-list");

    if (JSON.parse(localStorage.getItem("artists")).length) {
      let albums = JSON.parse(localStorage.getItem("albums"));
      let artists = JSON.parse(localStorage.getItem("artists"));
      let artistsAlbums;

      for (let artist of artists) {
        artistsAlbums = [];
        albumsDiv = [];
        let picture = artist.images.find(
          (el) => el.width == 300 || el.width == 320
        );
        if (picture == undefined) continue;

        let idx = 0;
        albums.forEach((el) => {
          if (el.artists[0].name == artist.name)
            artistsAlbums.push({ album: el, idx: idx });
          idx++;
        });

        for (let i = 0; i < artistsAlbums.length; i++) {
          let picture = artistsAlbums[i].album.images.find(
            (el) => el.width == 300
          );
          html = `
          <div class="album">
            <div>
             <img src="${picture.url}">
             <p>${artistsAlbums[i].album.name}</p>
            </div>
            <div class="button-home">
              <button class="redirect-home" id="${artistsAlbums[i].idx}">Go to album</button>
            </div>
          </div>
          `;
          albumsDiv.push(html);
        }

        html = `
          <div class="item-box">
             <div>
                <img src="${picture.url}" alt="Artist's picture">
                <p title="${artist.name}">${artist.name}</p>
             </div>
              <div class="buttons">
               <div class="show-albums">
                <h4>See albums</h4>
                <i class="bi bi-caret-down"></i>
                <i class="bi bi-caret-up hidden"></i>
               </div>
               <div class="spotify-link">
                <h4>Listen on</h4>
                <i class="bi bi-spotify" id=${artist.external_urls.spotify}></i>
                </div>
                <button class="delete" id="${artist.name}">Delete</button>
              </div>
          </div>
          <div class="albums hidden">
            ${
              albumsDiv.length
                ? albumsDiv
                : `
                <div class="no-albums">
                  <h1>No albums saved</h1>
                  <button class="add-album" id="${artist.name}">Add Albums</button>
                </div>
                `
            }
          </div>
          `;
        displayResultDiv.insertAdjacentHTML("beforeend", html);
      }

      document.querySelectorAll(".bi-spotify").forEach((el) => {
        el.addEventListener("click", (e) => {
          window.location.assign(e.target.id);
        });
      });

      let showAlbums = [...document.querySelectorAll(".bi-caret-down")];
      let hideAlbums = [...document.querySelectorAll(".bi-caret-up")];
      let divAlbums = [...document.querySelectorAll(".albums")];

      for (let i = 0; i < showAlbums.length; i++) {
        showAlbums[i].addEventListener("click", () => {
          showAlbums[i].classList.add("hidden");
          hideAlbums[i].classList.remove("hidden");
          divAlbums[i].classList.remove("hidden");
        });
      }

      for (let i = 0; i < hideAlbums.length; i++) {
        hideAlbums[i].addEventListener("click", () => {
          hideAlbums[i].classList.add("hidden");
          showAlbums[i].classList.remove("hidden");
          divAlbums[i].classList.add("hidden");
        });
      }

      let redirectButtons = [...document.querySelectorAll(".redirect-home")];

      for (let i = 0; i < redirectButtons.length; i++) {
        redirectButtons[i].addEventListener("click", (e) => {
          localStorage.setItem(
            "redirect",
            JSON.stringify({
              idx: e.target.id,
            })
          );
          window.location.href = "home.html";
        });
      }

      let addAlbum = [...document.querySelectorAll(".add-album")];

      for (let i = 0; i < addAlbum.length; i++) {
        addAlbum[i].addEventListener("click", (e) => {
          App.sendSearch(e.target.id, false, window.location.pathname);
        });
      }

      let deleteButtons = [...document.querySelectorAll(".delete")];

      for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", (e) => {
          for (let j = 0; j < artists.length; j++) {
            if (artists[j].name == e.target.id) {
              artists.splice(j, 1);
              localStorage.setItem("artists", JSON.stringify(artists));
              break;
            }
          }
          window.location.href = "artists.html";
        });
      }
    } else {
      html = `<h1 class="no-result">No artists saved</h1>`;
      displayResultDiv.insertAdjacentHTML("beforeend", html);
    }
  };

  const _loadSearchEls = (previous) => {
    let main = document.getElementById("main-section");
    main.innerHTML = "";
    main.insertAdjacentHTML("beforeend", mainSearch);
    main.insertAdjacentHTML("beforeend", searchBoxResult);

    document.getElementById("main-form").addEventListener("submit", (e) => {
      e.preventDefault();
      let input = document.getElementById("main-search-input");
      App.sendSearch(input.value, true, previous);
    });
  };

  const _loadAlbumsCarrousel = () => {
    let html;
    let carrouselDiv = document.getElementById("albums-carrousel");
    let albums = JSON.parse(localStorage.getItem("albums"));
    let storageIdx = 0;

    for (let album of albums) {
      let picture = album.images.find((el) => el.width == 300);
      if (picture == undefined) continue;
      html = `
        <div class="album-item hidden" id="${storageIdx}">
          <img src="${picture.url}" id="${album.id}" alt="${album.name}" title="${album.name}">
          <h2 class="hidden-title" title="${album.name}">${album.name}</h2>
        </div>
        `;
      carrouselDiv.insertAdjacentHTML("beforeend", html);
      storageIdx++;
    }

    let middle;
    let elements = document.querySelectorAll(".album-item");
    if (localStorage.getItem("redirect") == "false") {
      middle = Math.floor(elements.length / 2);
    } else {
      let albumRedirect = JSON.parse(localStorage.getItem("redirect"));
      middle = Number(albumRedirect.idx);
    }

    elements[middle].classList.add("focused-album");

    let title = elements[middle].children.item(1);
    let titleLength = title.textContent.length;
    title.classList = "title-display";

    if (titleLength <= 5) {
      title.style.marginLeft = "6.3rem";
    }
    if (titleLength >= 5 && titleLength <= 15) {
      title.style.marginLeft = "4rem";
    }
    if (titleLength >= 15) {
      title.style.marginLeft = "1.5rem";
    }
    if (titleLength >= 19) {
      title.style.marginLeft = "0.5rem";
    }
    if (titleLength >= 21) {
      title.classList.add("truncate-title");
    }

    if (elements.length == 1) {
      elements[middle].style.marginLeft = "17rem";
    }

    if (elements.length == 2 || elements.length == 3) {
      carrouselDiv.style.paddingLeft = "7rem";
    }

    for (let i = middle - 2; i <= middle + 2; i++) {
      if (!elements[i]) continue;
      elements[i].classList.remove("hidden");
      elements[i].classList.add("displayed");
      if (i == middle) continue;
      if (i == middle - 1 || i == middle + 1) {
        elements[i].classList.add("next-album");
      }
      if (i == middle - 2 || i == middle + 2) {
        elements[i].classList.add("last-album");
      }
    }

    let id = elements[middle].children.item(0).id;
    let img = elements[middle].children.item(0).getAttribute("src");

    localStorage.setItem("currentAlbum", elements[middle].id);

    return {
      id,
      img,
    };
  };

  const _loadTracks = (tracks, albumImg) => {
    localStorage.setItem("isPlaying", false);

    let html;
    let singersArr;
    let singers;
    let duration;
    let seconds;
    let isPlayable = true;
    let play;
    let pause;

    let divTracks = document.getElementById("tracks");
    divTracks.innerHTML = "";

    for (let track of tracks) {
      singers = "";
      singersArr = [];
      track.artists.forEach((artist) => {
        singersArr.push(artist.name);
      });
      singers = singersArr.toString();
      duration = new Date(track.duration_ms);

      if (duration.getSeconds().toString().length == 1) {
        seconds = "0" + duration.getSeconds();
      } else {
        seconds = duration.getSeconds();
      }

      html = `
      <div>
        <div class="title-track">
          <div>
           ${
             track.preview_url
               ? `    
           <i class="bi bi-play-fill"></i>
           <i class="bi bi-pause hidden"></i>
           `
               : (isPlayable = "")
           }
           <img class="album-img" src=${albumImg}>
           <h2 title="${track.name}">${track.name}</h2>
           <p> - ${duration.getMinutes()}:${seconds}</p>
           ${track.explicit ? `<i class="bi bi-explicit"></i>` : ""}
          </div>
          <div class="spotify-link">
           <i class="bi bi-spotify" id=${track.external_urls.spotify}></i>
          </div>
        </div>
        <h3 title="${singers}" class="singers">${singers}</h3>
        
      </div>
      `;
      divTracks.insertAdjacentHTML("beforeend", html);
    }

    document.querySelectorAll(".bi-spotify").forEach((el) => {
      el.addEventListener("click", (e) => {
        window.location.assign(e.target.id);
      });
    });

    if (isPlayable) {
      play = [...document.querySelectorAll(".bi-play-fill")];
      pause = [...document.querySelectorAll(".bi-pause")];
      let song;

      for (let i = 0; i < play.length; i++) {
        play[i].addEventListener("click", () => {
          play[i].classList.add("hidden");
          pause[i].classList.remove("hidden");
          if (localStorage.getItem("isPlaying") == "false") {
            song = new Audio(tracks[i].preview_url);
            song.play();
            localStorage.setItem(
              "isPlaying",
              JSON.stringify({ idx: i, song: song })
            );
          } else {
            let audioInfo = JSON.parse(localStorage.getItem("isPlaying"));
            song.pause();
            pause[audioInfo.idx].classList.add("hidden");
            play[audioInfo.idx].classList.remove("hidden");

            song = new Audio(tracks[i].preview_url);
            song.play();
            localStorage.setItem("isPlaying", JSON.stringify({ idx: i, song }));
          }

          setTimeout(() => {
            pause[i].classList.add("hidden");
            play[i].classList.remove("hidden");
            localStorage.setItem("isPlaying", false);
          }, 30000);
        });
      }

      for (let i = 0; i < pause.length; i++) {
        pause[i].addEventListener("click", () => {
          pause[i].classList.add("hidden");
          play[i].classList.remove("hidden");
          song.pause();
        });
      }
    }
  };

  return {
    displaySearch(result) {
      return _displaySearch(result);
    },
    displaySavedAlbums() {
      return _displaySavedAlbums();
    },
    displaySavedArtists() {
      return _displaySavedArtists();
    },
    loadSearchEls(previous) {
      return _loadSearchEls(previous);
    },
    loadAlbumsCarrousel() {
      return _loadAlbumsCarrousel();
    },
    loadTracks(tracks, albumImg) {
      return _loadTracks(tracks, albumImg);
    },
  };
})();
