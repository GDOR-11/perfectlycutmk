// this minigame uses hashes to make sure that every guess is authentic

import { Context, Devvit, RedisClient, useAsync, useState } from "@devvit/public-api";
import { ComponentArgs } from "../component.js";
import { MenuIcon } from "../menu.js";
import { sha3_256 } from "@noble/hashes/sha3";

type Attempt = {
    key: number[],
    score: number
};
type LeaderboardEntry = {
    user: string,
    attempt: Attempt
};

const LEADERBOARD_LENGTH = 10;

/** create new attempt from desired key (or random, if unspecified) */
function new_attempt(key = new Uint8Array(32).map(() => 256 * Math.random())): Attempt {
    // generate hash from key
    let hash = sha3_256(key);
    let bigint = hash2bigint(hash);
    // get the mostly random bigint and apply modulo to fit it into a desired range
    let score = Number(bigint % 1000000000000001n);
    return { key: Array.from(key), score };
}

/** returns false if and only if the attempt is fake */
function verify_attempt(attempt: Attempt): boolean {
    return new_attempt(new Uint8Array(attempt.key)).score === attempt.score;
}

/** converts a hash to a bigint from 0 to 2^256 - 1 */
function hash2bigint(hash: Uint8Array) {
    // I'm not big brain enough to know if it's possible to do this only using JS functions,
    // so I just imperatively coded it, treating the hash as a 32 digit number in base 256.
    let bigint = 0n;
    for (let i = 0; i < hash.length; i++) {
        bigint += BigInt(hash[i]) << (8n * BigInt(i));
    }
    return bigint;
}

async function get_leaderboard(redis: RedisClient) {
    return (await redis.zRange(
        "luck-leaderboard", 0, LEADERBOARD_LENGTH - 1,
        { by: "rank", reverse: true }
    )).map(entry => {
        if (!entry.member.includes("/")) return undefined; // invalid item, discard it
        return {
            user: entry.member.split("/")[0].slice(0, 20),
            attempt: {
                key: entry.member.split("/")[1].split(",").map(str => parseInt(str)).slice(0, 32),
                score: entry.score
            }
        };
    }).filter(entry => entry !== undefined) as LeaderboardEntry[];
}

async function save_score(attempt: Attempt, context: Context) {
    const leaderboard = await get_leaderboard(context.redis);
    const username = (await context.reddit.getCurrentUser())?.username;
    const prev_best = leaderboard.find(entry => entry.user === username);

    // if the user's score is smaller than the smallest score in the leaderboard, we can stop here
    if (leaderboard[leaderboard.length - 1]?.attempt.score > attempt.score) return;

    // if the user already has another smaller score, delete it
    if (prev_best !== undefined) {
        if (attempt.score <= prev_best.attempt.score) return;
        await context.redis.zRem("luck-leaderboard", [prev_best.user + "/" + prev_best.attempt.key.join(",")]);
    }
    // add the user's new score
    await context.redis.zAdd("luck-leaderboard", {
        member: username + "/" + attempt.key.join(","),
        score: attempt.score
    });
    // delete all items beyond the maximum length (a.k.a. remove the 21st entry)
    await context.redis.zRemRangeByRank("luck-leaderboard", 0, -(LEADERBOARD_LENGTH + 1));
}

function LeaderboardItem(props: ComponentArgs & { entry: LeaderboardEntry }) {
    const { user, attempt } = props.entry;
    let valid_attempt = verify_attempt(attempt);
    return <hstack cornerRadius="medium" backgroundColor={valid_attempt ? "#004b00" : "#a00000"} padding="small">
        <text size="small" color="#1b75d0" onPress={() => props.context.ui.navigateTo("https://www.reddit.com/u/" + user)}>u/{user}</text>
        {valid_attempt ? <>
            <text size="small" wrap>: {attempt.score}</text>
        </> : <>
            <spacer width="3px"></spacer>
            <text size="small" wrap>is a hacker</text>
        </>}
    </hstack>
}

export default function LuckiestRedditor(props: ComponentArgs) {
    const { redis, kvStore } = props.context;

    // // for testing purposes
    // redis.del("luck-leaderboard");
    // kvStore.delete("best");
    // throw "done";

    const [attempt, setAttempt] = useState(new_attempt);

    const { data: best, loading: loading_best } = useAsync(async () => {
        let best = await kvStore.get("best") as number || 0;
        // if there is a new best, update it in kvStore and in the redis leaderboard
        if (attempt.score > best) {
            best = attempt.score;
            await kvStore.put("best", best);
            await save_score(attempt, props.context);
        }
        return best;
    }, { depends: attempt });

    const { data: leaderboards } = useAsync(async () => get_leaderboard(redis), { depends: attempt });

    return (
        <zstack width="100%" height="100%" alignment="start top" padding="xsmall">
            <hstack width="100%" height="100%" alignment="middle center" gap="large">
                <vstack alignment="start middle" width="200px" gap="small">
                    <text>result: {attempt.score}</text>
                    <text>best: {loading_best ? "loading..." : best}</text>
                    <button appearance="primary" onPress={() => setAttempt(() => new_attempt())}>try again</button>
                </vstack>
                <vstack alignment="top center" width="350px" gap="medium">
                    <text size="large" style="heading">leaderboard</text>
                    <vstack width="100%" backgroundColor="black" cornerRadius="medium" padding="medium" gap="small">
                        {leaderboards === null ? <text>loading...</text> : leaderboards?.map(entry => <LeaderboardItem entry={entry} {...props}></LeaderboardItem>)}
                    </vstack>
                </vstack>
            </hstack>
            <MenuIcon {...props}></MenuIcon>
        </zstack>
    );
}
