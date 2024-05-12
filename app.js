const d2gsi = require('dota2-gsi');
const server = new d2gsi({ port: 3123 });
const clientId = "1233930154267639919"; 
const DiscordRPC = require("discord-rpc"); 
const { ActivityType } = require("discord.js");
const { ActivityFlags } = require('discord.js');
const RPC = new DiscordRPC.Client({ transport: 'ipc'});
const axios = require('axios');
const api = require('steam-js-api')
const _ = require('lodash');
const ps = require('current-processes');

api.setKey('75F1D23D05739F1D68CEFF32155A02B1')

DiscordRPC.register(clientId);
RPC.login({ clientId }).catch(err => console.error(err));

i = 0;
x = 1;

const processNameToFind = 'dota2';

function mainDota() {
    RPC.setActivity({
        type: ActivityType.Playing,
        details: "Сидит в главном меню",
        largeImageKey: "https://i.imgur.com/ULcgHso.png"
    })
};

setInterval(() => {
    checkDota(); 
}, 5000);

server.events.on('newclient', (client) => {
    intervalId = setInterval(() => {
        setActivity(); 
    }, 5000);
    i = 1;

    console.log(`Новое подключение клиента, IP-адрес: ${client.ip}`);
    if (client.auth && client.auth.token) {
        console.log(`Токен аутентификации: ${client.auth.token}`);
    } else {
        console.log('Токен аутентификации отсутствует');
    }

    function handleNewData(newdata) {
        if (newdata) {
            console.log(newdata);
            client.removeAllListeners('newdata');
        }
    }

    function formatHeroName(heroId) {
        const parts = heroId.split('_');
        let heroName = '';

        for (const part of parts) {
            if (part !== 'npc' && part !== 'dota' && part !== 'hero') {
                heroName += part + ' ';
            }
        }

        heroName = heroName.trim();
        heroName = heroName.replace(/\b\w/g, char => char.toUpperCase());
        return heroName;
    };
    
    function avatarUrl(heroId) {
        const HeroName = heroId.split('npc_dota_hero_');
        let chest = '';
    
        for (const part of HeroName) {
            if (part !== 'npc' && part !== 'dota' && part !== 'hero') {
                chest += part + ' ';
            }
        }

        chest = chest.trim();
        url = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${chest}.png`;
        return url;
    };

    function setActivity() {
        client.on('newdata', handleNewData)
        try {
            if (client.gamestate.player.activity === "playing") {
                const currentTimestamp = Math.floor(Date.now() / 1000);
                const gameStateDuration = client.gamestate.map.clock_time;
                const gameStartTimestamp = currentTimestamp - gameStateDuration;

                if (
                    client.gamestate.items.slot0.name === 'item_aegis' ||
                    client.gamestate.items.slot1.name === 'item_aegis' ||
                    client.gamestate.items.slot2.name === 'item_aegis' ||
                    client.gamestate.items.slot3.name === 'item_aegis' ||
                    client.gamestate.items.slot4.name === 'item_aegis' ||
                    client.gamestate.items.slot5.name === 'item_aegis'
                ) {
                    url_aegis = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/2/20/Aegis_of_the_Immortal_icon.png/revision/latest?cb=20180214210935'
                } else {
                    url_aegis = "nike"
                }
    
                RPC.setActivity({ 
                    type: ActivityType.Playing,
                    details: `${formatHeroName(client.gamestate.hero.name)} -  ${client.gamestate.hero.level} lvl`,
                    state: `${client.gamestate.player.kills} / ${client.gamestate.player.deaths} / ${client.gamestate.player.assists}`,
                    largeImageKey: avatarUrl(client.gamestate.hero.name),
                    largeImageText: `💰 ${client.gamestate.player.gpm} | LH ${client.gamestate.player.last_hits} | DN ${client.gamestate.player.denies}`, 
                    smallImageKey: url_aegis,
                    startTimestamp: gameStartTimestamp,
                });
            } if (client.gamestate.map.gamestate === 'DOTA_GAMERULES_STATE_GAME_IN_PROGRESS'){
            }else {
                mainDota()
            }
        } catch (error) {
            if (checkDota) {
                mainDota()
            } else {
                RPC.clearActivity();
                i = 0;
            }
        }
    };
    })
