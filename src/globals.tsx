// all the global states are stored here

import { StateSetter } from "@devvit/public-api";
import Component from "./component.js";

type Globals = {
    /** current component being displayed to the user */
    current_component: Component
};
export default Globals;
export const default_globals: Globals = {
    current_component: "menu"
};

export function setComponent(setGlobals: StateSetter<Globals>, component: Component) {
    setGlobals(globals => {
        globals.current_component = component;
        return globals;
    });
}
