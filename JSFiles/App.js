"strict mode";
import { UIController } from "./UI.js";
import { APIController } from "./API.js";

const App = (function (UIController, APIController) {
  const _sendSearch = async (val) => {
    UIController.unloadHome();
    let token = await APIController.getToken();
    let result = await APIController.search(val, token);
    UIController.displaySearch(result);
  };

  return {
    sendSearch(input) {
      return _sendSearch(input);
    },
  };
})(UIController, APIController);

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let input = document.getElementById("search-input");
  App.sendSearch(input.value);
});
