# perfectlycutmk

A set of minigames made to entertain the members of r/perfectlycutMK

The usage of this app is pretty straightforward, just click the three dot menu and select "create minigames post".  
After that, the navigation of the app is completely intuitive, and doesn't need much explanation.

A lot of minigames will most likely have tons of bugs and be laggier than necessary, so I'm gonna apologise in advance for that.


## minigames

### click counter
Probably the simplest minigame, all you have to do is click the button of the side which you want to win.  
The progress bar is not linear, though. When both teams are even, the progress is made clearly visible, but when a team is dominating the bar starts to slow down.  
A team needs an advantage of 625 clicks in order to fully dominate over the other team.

### luckiest redditor
All you have to do is spam "try again" over and over until you're satisfied with your best score.  
The best score is saved across sessions, across accounts and even in incognito mode as well. Don't ask me how, I don't even know.  
The leaderboard is done in a way such that a malicious actor can wipe it out, but cannot inseirt fake scores.


## TODOs
- use server side functions and secrets storage to finally make it impossible to modify the redis database without validation
- finish the click counter minigame (it has no winning logic)


## changelog
- v0.0.10.0: created the app, with click counter and luckiest redditor as the first minigames
