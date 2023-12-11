"strict mode";
import { UIController } from "./UI.js";
import { APIController } from "./API.js";

export const App = (function (UIController, APIController) {
  const _sendSearch = async (val, isLoaded) => {
    if (!isLoaded) {
      UIController.unloadHome();
    }
    if (val !== "") {
      let token = await APIController.getToken();
      let result = await APIController.search(val, token);
      UIController.displaySearch(result);
    }
  };

  const _saveItems = async (data, isAlbum) => {
    if (isAlbum) {
      let albums = JSON.parse(localStorage.getItem("albums") || "[]");
      albums.push(data);
      localStorage.setItem("albums", JSON.stringify(albums));
    } else {
      let artists = JSON.parse(localStorage.getItem("artists") || "[]");
      artists.push(data);
      localStorage.setItem("artists", JSON.stringify(artists));
    }
  };

  const _getItems = async (id, isAlbum) => {
    let token = await APIController.getToken();
    if (isAlbum) {
      let album = await APIController.getAlbum(id, token);
      App.saveItems(album, isAlbum);
    } else {
      let artist = await APIController.getArtist(id, token);
      App.saveItems(artist, isAlbum);
    }
  };

  const _getSavedAlbums = () => {
    UIController.displaySavedAlbums();
  };

  const _getSavedArtists = () => {
    UIController.displaySavedArtists();
  };

  const _moveCarrousel = async (id, parentIdx) => {
    let classSets = {
      focused_album: "album-item displayed focused-album",
      next_album: "album-item displayed next-album",
      last_album: "album-item displayed last-album",
      hidden: "album-item hidden",
    };

    let elements = document.querySelectorAll(".album-item");

    document.getElementsByClassName("title-display")[0].classList =
      "hidden-title";

    elements[parentIdx].children.item(1).classList = "title-display";

    for (let i = parentIdx - 4; i <= parentIdx + 4; i++) {
      if (!elements[i]) continue;
      if (i == parentIdx) {
        elements[i].classList = classSets.focused_album;
        continue;
      }
      if (i == parentIdx + 1 || i == parentIdx - 1) {
        elements[i].classList = classSets.next_album;
      }
      if (i == parentIdx + 2 || i == parentIdx - 2) {
        elements[i].classList = classSets.last_album;
      }
      if (i == parentIdx + 3 || i == parentIdx - 3) {
        elements[i].classList = classSets.hidden;
      }
      if (i == parentIdx + 4 || i == parentIdx - 4) {
        !elements[i].classList.contains("hidden")
          ? (elements[i].classList = classSets.hidden)
          : console.log("Never gonna give you up, never gonna let you down");
      }
    }

    let token = await APIController.getToken();
    let tracks = await APIController.getAlbumTracks(id, token);
    UIController.loadTracks(tracks);
  };

  const _getCarrousel = async () => {
    let id = UIController.loadAlbumsCarrousel();
    let token = await APIController.getToken();
    let tracks = await APIController.getAlbumTracks(id, token);
    UIController.loadTracks(tracks);
  };

  return {
    sendSearch(input, isLoaded) {
      return _sendSearch(input, isLoaded);
    },
    saveItems(data, type) {
      return _saveItems(data, type);
    },
    getItems(id, isAlbum) {
      return _getItems(id, isAlbum);
    },
    getSavedAlbums() {
      return _getSavedAlbums();
    },
    getSavedArtists() {
      return _getSavedArtists();
    },
    moveCarrousel(id, parentIdx) {
      return _moveCarrousel(id, parentIdx);
    },
    getCarrousel() {
      return _getCarrousel();
    },
  };
})(UIController, APIController);

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let input = document.getElementById("search-input");
  App.sendSearch(input.value, false);
});

if (window.location.pathname.endsWith("albums.html")) {
  window.addEventListener("load", (e) => {
    e.preventDefault();
    App.getSavedAlbums();
  });
}

if (window.location.pathname.endsWith("artists.html")) {
  window.addEventListener("load", (e) => {
    e.preventDefault();
    App.getSavedArtists();
  });
}

if (window.location.pathname.endsWith("home.html")) {
  if (localStorage.getItem("albums")) {
    App.getCarrousel();
    document.querySelectorAll(".album-item").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        App.moveCarrousel(e.target.id, Number(e.target.parentElement.id));
      });
    });
  } else {
    let carrouselDiv = document.getElementById("albums-carrousel");
    let html = `
    <div id="no-album-box">
      <h1>No albums</h1>
      <button id="add">Add Albums</button>
    <div>
    `;
    carrouselDiv.insertAdjacentHTML("beforeend", html);
    document.getElementById("add").addEventListener("click", () => {
      App.sendSearch("", false);
    });
  }
}
