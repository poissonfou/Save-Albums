"strict mode";
import { UIController } from "./UI.js";
import { APIController } from "./API.js";

export const App = (function (UIController, APIController) {
  const _sendSearch = async (val) => {
    UIController.unloadHome();
    let token = await APIController.getToken();
    let result = await APIController.search(val, token);
    UIController.displaySearch(result);
  };

  const _reloadElements = async () => {
    UIController.loadHome();
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
    try {
      let token = await APIController.getToken();
      if (isAlbum) {
        let album = await APIController.getAlbum(id, token);
        App.saveItems(album, isAlbum);
      } else {
        let artist = await APIController.getArtist(id, token);
        App.saveItems(artist, isAlbum);
      }
    } catch (e) {
      console.log(e);
      alert("An error has ocurred. Try again");
    }
  };

  return {
    sendSearch(input) {
      return _sendSearch(input);
    },
    reloadElements() {
      return _reloadElements();
    },
    saveItems(data, type) {
      return _saveItems(data, type);
    },
    getItems(id, isAlbum) {
      return _getItems(id, isAlbum);
    },
  };
})(UIController, APIController);

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let input = document.getElementById("search-input");
  App.sendSearch(input.value);
});

window.addEventListener("popstate", App.reloadElements());
