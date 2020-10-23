const Discord = require('discord.js')
const client = new Discord.Client()
const prefix = '!'
const version = "1.0"
const Number = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣','9️⃣']
let timer = 0
let poll = false 

client.on('ready', () => {
    console.log('Pollster is online')
})

client.on('message', msg => {
    if(!msg.content.startsWith(prefix) || msg.author.bot) return
    let temp = msg.content.slice(prefix.length)
    let args = temp.endsWith(';') ? temp.slice(0, temp.length - 1).split(';') : temp.split(';')
    args = args.map(arg => arg.trim())
    let t = /^\d[smhdw]$/
    let time = 0
    if(t.test(args[args.length - 1])) {
        time = args[args.length - 1].replace(/^.[smhdw]$/,'')   //TODO - time
        args.length -= 1
    } else {
        time = 60000
    }
    let arg_0_splitted = args[0].split(' ')
    switch(arg_0_splitted[0]) {
        case 'poll':
            if(poll == true) {
                msg.channel.send("```One poll already runs! Close it and try again```")
                return
            }
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
                msg_id = sentEmbed.id
            })
            
            timer = setTimeout(function() {
                msg.channel.messages.fetch({around: msg_id, limit: 1})
                .then(messages => {
                    let x = messages.first().reactions.cache.array()
                    let max = 0, k = 0
                    for(let i = 0; i < x.length; i++) {
                        if(x[i].count > max) {
                            max = x[i].count
                            k = i
                        }
                    }
                    embed = new Discord.MessageEmbed()
                    .setTitle('**' + msg.author.username + '** : ' + title.charAt(0).toUpperCase() + title.slice(1))
                    .setColor('#F93A2F')
                    .addField('Winner is answer ' + Number[k] + ' : ' + args[k + 1] + '!', 'Congratulations!')
                    msg.channel.send(embed)
                })
            }, time);
        break;
        case 'close':
            poll = false
            if(timer === 0) {
                msg.channel.send('Any survey runs now!')
                return
            }
            clearTimeout(timer);
            msg.channel.send('Survey canceled')
        break
        case 'version':
            let embed2 = new Discord.MessageEmbed()
            .setTitle('Version: ' + version)
            .setColor('#F93A2F')
            msg.channel.send(embed2)
        break
    }
})

client.login('NzY5MTIyNzQzNzg2MTQzNzU0.X5KbXw.wgrzBLPDiyRurvDqUXpjizZBJvk')