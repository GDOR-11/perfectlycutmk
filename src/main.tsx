// prepare yourself for a lot of spaghetti
// I tried to add comments but I don't know if they're gonna be very useful

import { Devvit, useState } from "@devvit/public-api";
import { components } from "./component.js";
import Globals, { default_globals } from "./globals.js";

import "../server/main.js";

Devvit.configure({
    redditAPI: true,
    redis: true,
    realtime: true,
    kvStore: true
});

Devvit.addMenuItem({
    label: "Create minigames post",
    location: "subreddit",
    forUserType: "moderator",
    onPress: async (_event, { reddit, ui }) => {
        await reddit.submitPost({
            title: "perfectlycutMK minigames",
            subredditName: (await reddit.getCurrentSubreddit()).name,
            preview: <vstack height="100%" width="100%" alignment="middle center">
                <text size="large">Loading...</text>
            </vstack>
        });
        ui.showToast({ text: "Created post!" });
    },
});

Devvit.addCustomPostType({
    name: "Experience Post",
    height: "tall",
    render: context => {
        // TODO:
        // (async () => {
        //     let subreddit = await context.reddit.getCurrentSubreddit();
        //     let leaderboard = await context.reddit.getSubredditLeaderboard(subreddit.id);
        //     leaderboard.summary.data[0].
        // })();
        const [globals, setGlobals] = useState<Globals>(default_globals);
        const Component = components[globals.current_component].component;
        return <Component context={context} globals={globals} setGlobals={setGlobals}></Component>;
    },
});

export default Devvit;
