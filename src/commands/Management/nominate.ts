import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { GuildMember, Message, TextChannel } from 'discord.js';
import { FEEDBACK_GUILD, FEEDBACK_CHANNEL } from '@root/config';
import { newEmbed } from '@lib/util/util';
import { Levels } from '@lib/types/levels';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { Colors } from '@lib/types/enums';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Nominate someone to be a Skilled User.',
			usage: '<targetMember:membername>',
			helpUsage: '<member>'
		});
	}

	public async run(msg: KlasaMessage, [targetMember]: [GuildMember]): Promise<Message[]> {
		const feedbackGuild = this.client.guilds.cache.get(FEEDBACK_GUILD);
		if (!feedbackGuild) return;
		const feedbackChannel = feedbackGuild.channels.cache.get(FEEDBACK_CHANNEL) as TextChannel;
		if (!feedbackChannel) return;
		if (!targetMember) throw `You must provide either a valid member's name, their long ID, or tag them.`;
		const fetchedMember = await msg.guild.members.fetch(targetMember);

		const levels: Levels[] = await msg.guild.settings.get(GuildSettings.Levels);
		const hasLevel = !(levels.filter(level => level.user === fetchedMember.id).length === 0);
		const msgCount = hasLevel ? levels[levels.slice().map(level => level.user).indexOf(fetchedMember.id)].level : 'none';
		const lastChan = msg.guild.channels.cache.get(fetchedMember.lastMessageChannelID);
		const msgRatio = fetchedMember.lastMessage ? fetchedMember.lastMessage.channel.messages.fetch({ limit: 100 })
			.then(messages => messages.filter(m => m.author.id === fetchedMember.id).size) : 'none';

		const embed = newEmbed()
			.setTitle(`${fetchedMember.user.tag} has been nominated`)
			.setDescription(`${fetchedMember.user.tag} was nomiated by ${msg.author.tag}`)
			.addFields(
				{ name: 'Messages this week', value: `${msgCount}`, inline: true },
				{ name: 'Last active channel', value: lastChan ? lastChan.name : 'DM channel', inline: true },
				{ name: 'Message ratio', value: `Sent ${await msgRatio} of the last 100 messeges in the most recent channel.`, inline: true }
			)
			.setTimestamp(Date.now())
			.setColor(Colors.YoutubeRed);

		return Promise.all([
			msg.channel.send('Your nomination has been sent in, thanks!'),
			feedbackChannel.send(embed)
		]);
	}

	public async init(): Promise<void> {
		if (!FEEDBACK_GUILD || !FEEDBACK_CHANNEL) this.disable();
	}

}
