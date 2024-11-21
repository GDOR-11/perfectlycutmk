import { Devvit, useAsync, useState } from "@devvit/public-api";
import { ComponentArgs } from "../component.js";
import { MenuIcon } from "../menu.js";
import { increment_click_counter, get_click_counter } from "../../server/main.js";


// TODO: add a button to continuously try in the luckiest redditor minigame

export default function ClickCounter(props: ComponentArgs) {

    const [counter, setCounter] = useState(async () => await get_click_counter(props.context));
    const [increment, setIncrement] = useState<-1 | 0 | 1>(0);

    useAsync(async () => {
        if (increment === 0) {
            console.log(get_click_counter);
            setCounter(await get_click_counter(props.context));
        } else {
            console.log(increment_click_counter);
            setCounter(await increment_click_counter(increment, props.context))
        }
        return 0;
    }, { depends: [counter] });

    return <zstack width="100%" height="100%" alignment="start top" padding="xsmall">
        <hstack width="100%" height="100%" alignment="middle center" padding="small" gap="medium">
            <image url="evoPEKKA.jpeg" width="20%" imageWidth="535px" imageHeight="695px" />
            <vstack width="60%" height="100%" gap="medium" alignment="middle center">
                <hstack width="100%" height="40px" border="thick" borderColor="white" alignment="middle center">
                    <image url="solid_black.jpeg" resizeMode="fill" width={10 * Math.cbrt(counter / 5) + 50} imageWidth="1000px" imageHeight="1000px" />
                    <image url="solid_purple.jpeg" resizeMode="fill" grow height="100%" imageWidth="1000px" imageHeight="1000px" />
                </hstack>
                <hstack width="100%">
                    <button appearance="primary" onPress={async () => {
                        setCounter(counter + 1);
                        setIncrement(1);
                    }}>
                        vote PEKKA!
                    </button>
                    <spacer grow />
                    <button appearance="primary" onPress={async () => {
                        setCounter(counter - 1);
                        setIncrement(-1);
                    }}>
                        vote MK!
                    </button>
                </hstack>
            </vstack>
            <image url="evoMK.jpeg" width="20%" imageWidth="362px" imageHeight="528px" />
        </hstack>
        <MenuIcon {...props}></MenuIcon>
    </zstack>;
}
