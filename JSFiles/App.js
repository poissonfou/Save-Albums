"strict mode";
import { UIController } from "./UI.js";
import { APIController } from "./API.js";

export const App = (function (UIController, APIController) {
  const _sendSearch = async (val, isLoaded, previous) => {
    if (!isLoaded) {
      UIController.loadSearchEls(previous);
    }
    if (val !== "") {
      let token = await APIController.getToken();
      let result = await APIController.search(val, token);
      UIController.displaySearch(result);
      history.pushState({}, "Search", "search.html");
    }
    window.addEventListener("popstate", () => {
      window.location.href = previous;
    });
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

  const _moveCarrousel = async (id, parentIdx, img) => {
    let classSets = {
      focused_album: "album-item displayed focused-album",
      next_album: "album-item displayed next-album",
      last_album: "album-item displayed last-album",
      hidden: "album-item hidden",
    };

    let elements = document.querySelectorAll(".album-item");

    document.getElementsByClassName("title-display")[0].classList =
      "hidden-title";

    let title = elements[parentIdx].children.item(1);
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
    if (titleLength >= 22) {
      title.classList.add("truncate-title");
    }

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

    localStorage.setItem("currentAlbum", elements[parentIdx].id);

    let token = await APIController.getToken();
    let tracks = await APIController.getAlbumTracks(id, token);
    UIController.loadTracks(tracks, img);
  };

  const _getCarrousel = async () => {
    document.getElementById("tracks").classList.remove("hidden");
    let { id, img } = UIController.loadAlbumsCarrousel();
    let token = await APIController.getToken();
    let tracks = await APIController.getAlbumTracks(id, token);
    UIController.loadTracks(tracks, img);

    document.getElementById("tracks-delete").classList.remove("hidden");
  };

  return {
    sendSearch(input, isLoaded, previous) {
      return _sendSearch(input, isLoaded, previous);
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
    moveCarrousel(id, parentIdx, img) {
      return _moveCarrousel(id, parentIdx, img);
    },
    getCarrousel() {
      return _getCarrousel();
    },
  };
})(UIController, APIController);

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let input = document.getElementById("search-input");
  App.sendSearch(input.value, false, window.location.pathname);
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

if (
  window.location.pathname.endsWith("home.html") &&
  localStorage.getItem("redirect") == "false"
) {
  if (JSON.parse(localStorage.getItem("albums")).length) {
    App.getCarrousel();
    document.querySelectorAll(".album-item").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        App.moveCarrousel(
          e.target.id,
          Number(e.target.parentElement.id),
          e.target.src
        );
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
      App.sendSearch("", false, window.location.pathname);
    });
    document.getElementById("tracks").classList.add("hidden");
  }
}

if (
  window.location.pathname.endsWith("home.html") &&
  localStorage.getItem("redirect") !== "false"
) {
  App.getCarrousel();
  document.querySelectorAll(".album-item").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      App.moveCarrousel(
        e.target.id,
        Number(e.target.parentElement.id),
        e.target.src
      );
    });
  });
  localStorage.setItem("redirect", false);
}

if (
  JSON.parse(localStorage.getItem("albums")).length &&
  window.location.pathname.endsWith("home.html")
) {
  document.getElementsByClassName("delete")[0].addEventListener("click", () => {
    let idx = Number(localStorage.getItem("currentAlbum"));
    let albums = JSON.parse(localStorage.getItem("albums"));
    for (let i = 0; i < albums.length; i++) {
      if (i == idx) {
        albums.splice(i, 1);
        localStorage.setItem("albums", JSON.stringify(albums));
        break;
      }
    }
    window.location.href = "home.html";
  });
  if (!JSON.parse(localStorage.getItem("albums")).length) {
    document.getElementById("tracks-delete").classList.add("hidden");
  }
}
