"strict mode";
import { UIController } from "./UI.js";
import { APIController } from "./API.js";

export const App = (function (UIController, APIController) {
  const _sendSearch = async (val, isLoaded, previous) => {
    if (!isLoaded) {
      UIController.loadSearchEls(previous);
    }
    if (val !== "") {
      let token = localStorage.getItem("token");
      let result = await APIController.search(val, token);
      UIController.displaySearch(result);
      history.pushState({}, "Search", "search.html");
    }
    window.addEventListener("popstate", () => {
      window.location.href = previous;
    });
  };

  const _saveItems = async (id, isAlbum) => {
    let token = localStorage.getItem("token");
    if (isAlbum) {
      let album = await APIController.getAlbum(id, token);
      let albums = JSON.parse(localStorage.getItem("albums") || "[]");
      for (let i = 0; i < albums.length; i++) {
        if (albums[i].name == album.name) return;
      }
      albums.push(album);
      localStorage.setItem("albums", JSON.stringify(albums));
    } else {
      let artist = await APIController.getArtist(id, token);
      let artists = JSON.parse(localStorage.getItem("artists") || "[]");
      for (let i = 0; i < artists.length; i++) {
        if (artists[i].name == artist.name) return;
      }
      artists.push(artist);
      localStorage.setItem("artists", JSON.stringify(artists));
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

    let currentlySelected = document.getElementsByClassName("focused-album")[0];
    if (currentlySelected.id == id) return;

    let elements = document.querySelectorAll(".album-item");

    document.getElementsByClassName("title-display")[0].classList =
      "hidden-title";

    let title = elements[parentIdx].children.item(1);
    title.classList = "title-display";

    for (let i = parentIdx - 4; i <= parentIdx + 4; i++) {
      if (!elements[i]) continue;
      if (i == parentIdx) {
        elements[i].classList = classSets.focused_album;
      }
      if (i == parentIdx + 1 || i == parentIdx - 1) {
        elements[i].classList = classSets.next_album;
        if (i == parentIdx + 1) {
          elements[i].classList.add("adjust-position-next");
        }
      }
      if (i == parentIdx + 2 || i == parentIdx - 2) {
        elements[i].classList = classSets.last_album;
        if (i == parentIdx + 2) {
          elements[i].classList.add("adjust-position-last");
        }
      }
      if (i == parentIdx + 3 || i == parentIdx - 3) {
        elements[i].classList = classSets.hidden;
      }
      if (i == parentIdx + 4 || i == parentIdx - 4) {
        !elements[i].classList.contains("hidden")
          ? (elements[i].classList = classSets.hidden)
          : console.log("");
      }
    }

    let albums = JSON.parse(localStorage.getItem("albums"));
    let tracks;
    for (let album of albums) {
      if (album.id == id) {
        tracks = album.tracks.items;
        break;
      }
    }

    UIController.loadTracks(tracks, img);
  };

  const _getCarrousel = async () => {
    let main = document.getElementById("main-section");
    main.classList = "";
    document.getElementById("tracks").classList.remove("hidden");
    let { id, img } = UIController.loadAlbumsCarrousel();
    let albums = JSON.parse(localStorage.getItem("albums"));
    let tracks;

    for (let album of albums) {
      if (album.id == id) {
        tracks = album.tracks.items;
        break;
      }
    }

    UIController.loadTracks(tracks, img);
    document.getElementById("tracks-delete").classList.remove("hidden");
    //deletes album from collection
    document
      .getElementsByClassName("delete")[0]
      .addEventListener("click", () => {
        let idx = document.getElementsByClassName("focused-album")[0].id;
        let albums = JSON.parse(localStorage.getItem("albums"));
        albums.splice(idx, 1);
        localStorage.setItem("albums", JSON.stringify(albums));

        window.location.href = "home.html";
      });
    if (!albums.length) {
      document.getElementById("tracks-delete").classList.add("hidden");
    }
  };

  const _requestToken = async () => {
    let token = await APIController.getToken();
    return token;
  };

  return {
    sendSearch(input, isLoaded, previous) {
      return _sendSearch(input, isLoaded, previous);
    },
    saveItems(id, isAlbum) {
      return _saveItems(id, isAlbum);
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
    requestToken() {
      return _requestToken();
    },
  };
})(UIController, APIController);

//rerequests token
(async function () {
  let token = await App.requestToken();
  localStorage.setItem("token", token);
})();

let delay = 1000 * 60 * 60;
setInterval(async () => {
  let token = await App.requestToken();
  localStorage.setItem("token", token);
}, delay);

if (localStorage.getItem("redirect") == null) {
  localStorage.setItem("redirect", false);
}

//events for header search
document
  .getElementsByClassName("bi-search")[0]
  .addEventListener("click", () => {
    let input = document.getElementById("search-input");
    App.sendSearch(input.value, false, window.location.pathname);
  });

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let input = document.getElementById("search-input");
  App.sendSearch(input.value, false, window.location.pathname);
});

//loads saved albums data
if (window.location.pathname.endsWith("albums.html")) {
  window.addEventListener("load", (e) => {
    e.preventDefault();
    App.getSavedAlbums();
  });
}

//loads saved artists data
if (window.location.pathname.endsWith("artists.html")) {
  window.addEventListener("load", (e) => {
    e.preventDefault();
    App.getSavedArtists();
  });
}

//loads home page;
if (window.location.pathname.endsWith("index.html")) {
  if (
    localStorage.getItem("albums") &&
    JSON.parse(localStorage.getItem("albums")).length
  ) {
    App.getCarrousel();

    if (JSON.parse(localStorage.getItem("redirect")) !== false) {
      localStorage.setItem("redirect", false);
    }
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

//change header

const headerPopup = `
<div class="popup-container">
  <ul class="popup-menu">
   <li>
    <a href="./index.html">
      <h3>Home</h3>
    </a>
   </li>
   <li>
    <a href="./albums.html">
     <h3>Albums</h3>
    </a>
   </li>
   <li>
    <a href="./artists.html">
     <h3>Artists</h3>
    </a>
   </li>
  </ul>
</div>
`;

if (window.innerWidth < 750) {
  document.getElementById("header").firstElementChild.innerHTML =
    '<i class="bi bi-list" id="menu"></i>';

  document.getElementById("menu").addEventListener("click", (event) => {
    if (event.target.parentElement.children.length == 1) {
      event.target.parentElement.insertAdjacentHTML("beforeend", headerPopup);
    } else {
      document.getElementsByClassName("popup-container")[0].remove();
    }
  });
}

if (window.innerWidth > 800) {
  document.getElementById("header").firstElementChild.innerHTML = `
  <div>
    <a href="./index.html">
      <h1>Home</h1>
    </a>
  </div>
  <div>
   <a href="./albums.html">
      <h1>Albums</h1>
   </a>
  </div>
  <div>
  <a href="./artists.html">
      <h1>Artists</h1>
  </a>
  </div>`;
}

window.addEventListener("resize", () => {
  if (window.innerWidth < 750) {
    document.getElementById("header").firstElementChild.innerHTML =
      '<i class="bi bi-list" id="menu"></i>';

    document.getElementById("menu").addEventListener("click", (event) => {
      if (event.target.parentElement.children.length == 1) {
        event.target.parentElement.insertAdjacentHTML("beforeend", headerPopup);
      } else {
        document.getElementsByClassName("popup-container")[0].remove();
      }
    });
  } else {
    document.getElementById("header").firstElementChild.innerHTML = `
    <div>
      <a href="./index.html">
        <h1>Home</h1>
      </a>
    </div>
    <div>
     <a href="./albums.html">
        <h1>Albums</h1>
     </a>
    </div>
    <div>
    <a href="./artists.html">
        <h1>Artists</h1>
    </a>
    </div>`;
  }
});
