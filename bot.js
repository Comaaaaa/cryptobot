const { Client } = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const bot = new Client();

bot.login(process.env.DISCORD_BOT_TOKEN);

bot.on('ready', () => {
  console.log(`${bot.user.username} fonctionne correctement!`);
});

bot.on('message', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('$ping')) {
    return message.reply(`Je suis actuellement en train d'analyser le marcher!`);
  }

  if (message.content.startsWith('$price')) {
    const [command, ...args] = message.content.split(' ');

    if (args.length !== 2) {
      return message.reply(
        'Tu dois indiquer la crypto que tu souhaites comparer avec la monnaie de change de ton choix'
      );
    } else {
      const [coin, vsCurrency] = args;
      try {
        const { data } = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${vsCurrency}`
        );
        if (!data[coin][vsCurrency]) throw Error();

        return message.reply(
          `Le prix de 1 ${coin} est de ${data[coin][vsCurrency]} ${vsCurrency}`
        );
      } catch (err) {
        return message.reply(
          'Vérifie ta saisie . Par exemple: $price bitcoin usd'
        );
      }
    }
  }

  if (message.content.startsWith('$news')) {
    try {
      const { data } = await axios.get(
        `https://newsapi.org/v2/everything?q=crypto&apiKey=${process.env.NEWS_API_KEY}&pageSize=1&sortBy=publishedAt`
      );

      const {
        title,
        source: { name },
        description,
        url,
      } = data.articles[0];

      return message.reply(
        `Dernière nouvelle sur la crypto:\n
        Titre: ${title}\n
        Description:${description}\n
        Source: ${name}\n
        Lien vers l'article: ${url}`
      );
    } catch (err) {
      return message.reply('Erreur du serveur, veuillez ressayer plus tard.');
    }
  }
  if (message.content.startsWith('$help')) {
    return message.reply(
      `Mon très gentil dev m'a attribuer que 4 commandes:\n
      $ping - Pour vérifier si je marche\n
      $price <nom de la crypto> <change de ton choix> - Te permet d'avoir le prix d'une crypto en comparaison avec la change de ton choix\n
      $news - Pour avoir le dernier article concernant les cryptos\n
      $help - Pour vérifier les commandes disponibles\n`
    );
  }
});