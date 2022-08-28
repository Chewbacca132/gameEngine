//maybe should be changed to json
input.addEvent("up", "w", true);
input.addEvent("down", "s", true);
input.addEvent("left", "a", true);
input.addEvent("right", "d", true);
input.addEvent("fire", "mouse0", true);

assetLoader.loadSprite("ball", "https://th.bing.com/th/id/R.5bb47523d4ec794f6ac45dfb359b2d6f?rik=59a%2bDltI6EqxUw&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_29736.png&ehk=vNFjHiGnroP%2fF02dRtJSSXA%2foTxfUhbrDvPhaygvDQs%3d&risl=&pid=ImgRaw&r=0");

render.addRenderer("ball", render.renderMode.Renderer, "ball");