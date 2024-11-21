import { Context, Devvit } from "@devvit/public-api";
import { sha3_256 } from "@noble/hashes/sha3";

// general purpose password for everything that needs to be accessible only by the server
Devvit.addSettings([{
    name: "password",
    label: "password",
    type: "string",
    isSecret: true,
    scope: "app"
}]);

/** converts a string which may possible be known by a lot of people into a string only the developer is able to know */
async function redis_key(context: Context, key: string): Promise<string> {
    key += await context.settings.get("password") as string; // concatenate the password
    const hashed = sha3_256(new TextEncoder().encode(key)); // apply a hash function
    return new TextDecoder().decode(hashed); // return a hashed string
}

/** Changes the value of click counter by amount. Do not try to use an amount different than 1 or -1. */
export async function increment_click_counter(amount: number, context: Context): Promise<number> {
    if (Math.abs(amount) !== 1) throw "f*** you"; // friendly message for anyone trying to mess with the counter
    return await context.redis.incrBy(await redis_key(context, "click-counter"), amount);
}

/** returns the current value of the click counter, or NaN if it's not a number or undefined */
export async function get_click_counter(context: Context): Promise<number> {
    return parseInt(await context.redis.get(await redis_key(context, "click-counter")) as string);
}
