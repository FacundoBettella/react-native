import { registerRootComponent } from "expo";
import App from "./App";
import { initializeAuthListener } from "./src/utils/authListener";

initializeAuthListener();

registerRootComponent(App);
