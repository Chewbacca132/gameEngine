const singleplayerRenderer = {};

singleplayerRenderer.render = function(){

    if (!this.game) return;
}

singleplayerRenderer.start = function(game){
    this.game = game;
    this.render(game);
}