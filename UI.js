"strict mode";

export const UIController = (function () {
  const _displayTracks = (tracks, img) => {
    let tracksDiv = document.querySelectorAll("#tracks");
    let html;
    tracks.forEach((x) => {
      html = `
                <div>
                    <img src="${img.url}" alt="Album cover">
                    <p>${x.name}</p>
                </div>
            `;
      tracksDiv.appendChild(html);
    });
  };

  return {
    displayTracks(tracks, img) {
      return _displayTracks(tracks, img);
    },
  };
})();
