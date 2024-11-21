// here lie all the types used to handle components

import { Devvit, StateSetter } from "@devvit/public-api";
import Menu from "./menu.js";
import ClickCounter from "./minigames/click_counter.js";
import LuckiestRedditor from "./minigames/luckiest_redditor.js";
import Globals from "./globals.js";

/** all the components of the entire app, but with an ugly type that I can't stand looking at */
const _components = {
    "menu": {
        component: Menu,
        minigame: false,
    },
    "click counter": {
        component: ClickCounter,
        minigame: true
    },
    "luckiest redditor": {
        component: LuckiestRedditor,
        minigame: true
    }
};

/** identifier of a component */
type Component = keyof typeof _components;
export default Component;

/** all the components of the entire app */
export const components: Record<Component, {
    component: (args: ComponentArgs) => JSX.Element,
    minigame: boolean
}> = _components;

/** the arguments given to every Component */
export interface ComponentArgs {
    context: Devvit.Context;
    globals: Globals;
    setGlobals: StateSetter<Globals>;
};
