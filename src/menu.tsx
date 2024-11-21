import { Devvit } from "@devvit/public-api";
import Component, { ComponentArgs, components } from "./component.js";
import { setComponent } from "./globals.js";

// TODO: if the app keeps growing and at some point there are too many minigames,
//       use an hstack of vstacks to make a matrix of buttons
export default function Menu({ context, setGlobals }: ComponentArgs) {
    // get all components, filter out the ones that aren't minigames, and turn each minigame into a button to be displayed
    const buttons = Object.keys(components)
        .map(component_name => component_name as Component)
        .filter(component => components[component].minigame)
        .map(minigame => (
            <button appearance="primary" width="100%" onPress={() => setComponent(setGlobals, minigame)}>
                {minigame}
            </button>
        ));

    return <zstack width="100%" height="100%">
        <hstack padding="small">
            <text size="xsmall">if you have more ideas for this app, message</text>
            <spacer width="3px" />
            <text size="xsmall" color="#1B75D0" onPress={() => context.ui.navigateTo("https://www.reddit.com/u/GDOR-11")}>u/GDOR-11</text>
        </hstack>
        <zstack width="100%" height="100%" alignment="center middle">
            <vstack gap="small">{buttons}</vstack>
        </zstack>
    </zstack>;
}

// small sandwich menu in the top left corner of each minigame
export function MenuIcon({ setGlobals }: ComponentArgs) {
    return <button icon="menu" onPress={() => setComponent(setGlobals, "menu")}></button>;
}
