const { Client, Events, GatewayIntentBits } = require('discord.js');
// const { token, channelId } = require(''); json 형식에 토큰이랑 채널ID 동시에 받기 가능
const { token } = require('../JSON_File/DiscordAPIKey.json');
const fs = require('fs');
const filePath = './Main_Web_Project/JSON_File/channelInfo.json';
const express = require('express');
const app = express();
const port = 3594
const date = new Date();
var cors = require("cors");
const voiceChannel = ['697642680292868112','714629856691748895','842404940416679966','842405026265301012'];
function getDate(){
    var todayDate = `${ date.getFullYear() }년 ${ date.getMonth() + 1 }월 ${ date.getDate() }일`
    return todayDate;
}
function getTime() {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0'); // 초(Second)를 구하는 코드
    let Nowtime = `${hours}시 ${minutes}분 ${seconds}초`;
    return Nowtime;
}
function update() {
    const channelInfoArray = [];
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
    client.once(Events.ClientReady, () => {
        console.log(`만남의 광장의 서버데이터를 불러왔습니다.\n활성화 봇 : ${client.user.tag}\n요청 일자 >\n`, getDate(), '\n', getTime());
        const guild = client.guilds.cache.first();
        if (guild) {
            for (let i = 0; i < voiceChannel.length; i++) {
                const channel = guild.channels.cache.get(voiceChannel[i]);
                const channelInfo = {
                    id: channel.id,
                    name: channel.name,
                    type: channel.type,
                    guildId: guild.id,
                    guildName: guild.name,
                    guildIcon: guild.iconURL(),
                    guildMember : guild.memberCount,
                    members: channel.members.map(member => ({
                        id: member.id,
                        username: member.user.username,
                        discriminator: member.user.discriminator,
                        avatar: member.user.avatar ? member.user.avatarURL() : 'https://github.com/LGNLogAN/Web/blob/main/Main_Web_Project/img/DIscordDefault.jpg?raw=true',
                        nickname: member.nickname
                    }))
                };
                channelInfoArray.push(channelInfo);
            }
            const channelInfoJson = JSON.stringify(channelInfoArray, null, 2);
            console.log('Discord Information :\n', channelInfoJson);
            fs.writeFileSync(filePath, channelInfoJson);
        } else {
            console.error("디스코드 서버가 존재하지 않습니다");
        }
    });

    client.login(token);
}
app.use(cors());

app.get('/discordAPI',(req , res) => {
    update();
    fs.readFile('./Main_Web_Project/JSON_File/channelInfo.json','utf8' , (err,data) => {
        if(err){
            console.error('Error reading JSON file:', err);
            res.status(500).send('Server Error');
            return;
        }
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    });
});

app.listen(port , () => {
    console.log("데이터를 수신할 준비가 완료되었습니다.");
})
