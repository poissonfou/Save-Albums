"strict mode";
import { UIController } from "./UI.js";
import { APIController } from "./API.js";

export const App = (function (UIController, APIController) {
  const _sendSearch = async (val, isLoaded) => {
    if (!isLoaded) {
      UIController.unloadHome();
    } else {
      UIController.refreshSearch();
    }
    let token = await APIController.getToken();
    let result = await APIController.search(val, token);
    UIController.displaySearch(result);
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

  const _moveCarrousel = (parentIdx, classes) => {
    let elements = document.querySelectorAll(".album-item");
    console.log(elements[parentIdx]);

    elements[parentIdx].classList.add("focused-album");
    if ([...classes].includes("next-album")) {
      elements[parentIdx].classList.remove("next-album");
    } else {
      elements[parentIdx].classList.remove("last-album");
    }

    //Think about it like an array!!!
  };

  const _getCarrousel = () => {
    UIController.loadAlbumsCarrousel();
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
    moveCarrousel(parentIdx, classes) {
      return _moveCarrousel(parentIdx, classes);
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
  App.getCarrousel();
}

if (localStorage.getItem("albums")) {
  document.querySelectorAll(".displayed").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      App.moveCarrousel(
        e.target.parentElement.id,
        e.target.parentElement.classList
      );
    });
  });
}
