const Discord = require('discord.js')
const { version } = require('./package.json');
const { prefix } = require('./package.json');
const client = new Discord.Client()
const Number = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣','9️⃣']


client.on('ready', () => {
    console.log('Pollster is online')
})

client.on('message', msg => {
    if(!msg.content.startsWith(prefix) || msg.author.bot) return
    let temp = msg.content.slice(prefix.length)
    let args = temp.endsWith(';') ? temp.slice(0, temp.length - 1).split(';') : temp.split(';')
    args = args.map(arg => arg.trim())
    let t = /^\d+[smhdw]$/
    let time = 0
    if(t.test(args[args.length - 1])) {
        let char = args[args.length - 1].slice(-1)
        switch(char) {
            case 's':
                time = args[args.length - 1].slice(0, -1) * 1000
            break
            case 'm':
                time = args[args.length - 1].slice(0, -1) * 60000
            break
            case 'h':
                time = args[args.length - 1].slice(0, -1) * 3600000
            break
            case 'd':
                time = args[args.length - 1].slice(0, -1) * 84400000
            break
            case 'w':
                time = args[args.length - 1].slice(0, -1) * 604800000
            break
        }
        args.length -= 1
    } else {
        time = 60000 * 5
    }
    let arg_0_splitted = args[0].split(' ')
    switch(arg_0_splitted[0]) {
        case 'poll':
            if(arg_0_splitted.length == 1 || args.length < 3) {
                msg.channel.send("```Insert question and at least 2 answers!```")
                return
            }
            if(args.length > 9) {
                msg.channel.send("```You can't enter more than 9 answers!```")
                return
            }
            pool = true
            let title = args[0].slice(5)
            let embed = new Discord.MessageEmbed()
            .setTitle('**' + msg.author.username + '** : ' + title.charAt(0).toUpperCase() + title.slice(1))
            .setColor('#F93A2F')
            for(let i = 1; i < args.length; i++) {
                embed.addField('Answer ' + Number[i - 1], args[i], true)
            }
            msg.channel.send(embed).then(sentEmbed => {
                for(let i = 1; i < args.length; i++) {
                    sentEmbed.react(Number[i - 1])
                }
                let filter = (reaction) => Number.includes(reaction.emoji.name)
                sentEmbed.awaitReactions(filter, { time: time })
                .then(collected => {
                    let coll = collected.array()
                    let max = 0, k = 0
                    for(let i = 0; i < coll.length; i++) {
                        if(coll[i].count > max) {
                            max = coll[i].count
                            k = i
                        }
                    }
                    embed = new Discord.MessageEmbed()
                    .setTitle('**' + msg.author.username + '** : ' + title.charAt(0).toUpperCase() + title.slice(1))
                    .setColor('#F93A2F')
                    .addField('Winner is answer ' + Number[k] + ' : ' + args[k + 1] + '!', 'Congratulations!')
                    msg.channel.send(embed)
                })
            })
        break;
        case 'info':
            let embed2 = new Discord.MessageEmbed()
            .setTitle('Usage information')
            .setColor('#F93A2F')
            .addField('!poll question; answer1; answer2; ...', 'Creates new poll which lasts for five minutes')
            .addField('!poll question; answer1; answer2; ... ; 5h', 'Creates new poll with custom expiration time [s, m, h, d, w] (seconds, minutes, etc.)')
            .addField('!info','Shows this page')
            .addField('!version','Shows version')
            .setFooter('by @Grzanol')
            msg.channel.send(embed2)
        break
        case 'version':
            let embed3 = new Discord.MessageEmbed()
            .setTitle('Version: ' + version)
            .setColor('#F93A2F')
            msg.channel.send(embed3)
        break
    }
})

client.login(process.env.token)