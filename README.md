# Pong

## Binome

- ***RACHEDI Ilyas***
- ***SAADI Nadine***

## Présentation du projet

- Il s'agit tout simplement de l'historique je de **Pong**, implemanté avec une système de connexion/déconnexion multi-joueurs en ligne en passant par le serveur locale.
- Pour y jouer, il vous faut 2 joueurs pour commencer a y jouer, en vous rendant sur la page du jeu de la machine qui sert de serveur ```http://ipserver:2222/public/index.html```, cliquer sur le bouton **Connect** pour vous connecter au server, attendre qu'un autre joueur rejoins le jeu et puis commencer y jouer ***:-)*** .
- Pour quiter le jeu, il suffit juste de cliquer sur le bouton **Disconnect**.   
### Quelques remarques sur le jeu
- Seul le joueur #1 peut lancer/relancer le jeu avec le bouton **Jouer** pour lancer et la touche pour relancer ***SpaceBare*** du clavier en lancant la balle.
- Seuls 2 joueurs peuvent se connecter au server, toute autre connexion au delas sera rejeté
- le boutton **Coonect** passe au vert quand le joueur est connecté au server et au rouge quand on est déconnecté.
- Si il n y a qu'un joueur connecté, me jeu ne pourra pas commencer.
- Si l'un des joueurs quitte la partie, la partie est fini et l'autre joueur est automatiquement déconnecté.
- Un but est accordé si la balle touche la parroie du joueur en face.
### Clonage du depot
il vous suffit pour cela de cloner le depot git sur votre machine locale avec la commande suivante:
***git clone https://github.com/yvss2359/Pong.git***
### Lancement du server en local
Pour lancer le server de pong et commencer à vous amuser, il vous suffit de suivre les étapes suivantes.
- Lancer un terminal et se mettre dans le dossier server et lancer le server avec la commande ```npm install```
- Lancer le server avec la commande ```nodemon```et voila le server est activé par votre machine qui fait office de server
- Rendz vous maintenant au dossier client toujour avec le terminal et installer le webpacka avec la commande ``` npm install webpack webpack-cli --save-dev ```
- Lancer du meme dossier (client) la surveillance du webpack pour recevoir le code js avec la commande ``` npm run watch ```

**Il vous reste plus qu'a commencer a jouer ;-)**


#### Remarques
- La balle a un peut de mal a se synchroniser parfois.
- Le chat commencé mais finalement abondonné car quand on recoit un message et qu'on l'ecrit le canvas du paddle se décale a chaque message.
