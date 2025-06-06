const Discord = require("discord.js")
const db = require('quick.db')
const owner = new db.table("Owner")
const cl = new db.table("Color")
const ml = new db.table("modlog")
const config = require("../config")
const fs = require('fs')
const moment = require('moment')
const p3 = new db.table("Perm3")

module.exports = {
    name: 'kick',
    usage: 'kick <membre>',
    description: `Permet de kick un membre.`,
    async execute(client, message, args) {

        const perm3 = p3.fetch(`perm3_${message.guild.id}`)
        let color = cl.fetch(`color_${message.guild.id}`)
        if (color == null) color = config.bot.couleur

            if (owner.get(`owners.${message.author.id}`) || message.member.roles.cache.has(perm3) || config.bot.buyer.includes(message.author.id)   === true) {

            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

            if (!member) {
                return message.reply("Merci de mentionner l'utilisateur que vous souhaitez kick du serveur !")
            }

            if (member.id === message.author.id) {
                return message.reply("Tu ne peux pas te kick")
            }

            let reason = args.slice(1).join(" ") || `Aucune raison`

            message.reply({ content: `${member} a été expulsé du serveur` }).catch(err => err)
            member.kick(`${reason}`).catch(() => false)

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`<@${message.author.id}> a \`expulsé\` ${member} du serveur\nRaison : ${reason}`)
                .setTimestamp()
                .setFooter({ text: `📚` })
                const logchannel = client.channels.cache.get(ml.get(`${message.guild.id}.modlog`))
                if (logchannel) logchannel.send({ embeds: [embed] }).catch(() => false)
        }

        else if (message.member.roles.cache.has(p3.get(`perm3_${message.guild.id}`)) === true) {

            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

            if (!member) {
                return message.reply("Merci de mentionner l'utilisateur que vous souhaitez kick du serveur !")
            }

            if (member.id === message.author.id) {
                return message.reply("Tu ne peux pas te kick !")
            }

            if (member.roles.highest.position >= message.member.roles.highest.position || message.author.id !== message.guild.owner.id) {
                return message.reply(`Vous ne pouvez pas kick un membre au dessus de vous`)
            }

            let reason = args.slice(1).join(" ") || `Aucune raison`

            message.reply({ content: `${member} a été expulsé du serveur` })
            member.kick(`${reason}`)

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`<@${message.author.id}> a \`expulsé\` ${member} du serveur\nRaison : ${reason}`)
                .setTimestamp()
                .setFooter({ text: `📚` })
                const logchannel = client.channels.cache.get(ml.get(`${message.guild.id}.modlog`))
                if (logchannel) logchannel.send({ embeds: [embed] }).catch(() => false)

        }
    }
}