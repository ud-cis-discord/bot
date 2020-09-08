import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message, TextChannel } from 'discord.js';
import { UserSettings } from '@lib/types/settings/UserSettings';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { newEmbed } from '@lib/util/util';
import { Colors } from '@lib/types/enums';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Get yourself verified',
			examples: ['verify Ben Segal | bensegal@udel.edu | 702425559'],
			extendedHelp: 'Provide your real name first, then your @udel.edu email, then your udid',
			runIn: ['dm', 'text'],
			usage: '<name:string> <email:string> <udid:string>',
			helpUsage: 'Name | Email | UDID'
		});
	}

	public async run(msg: KlasaMessage, [name, email, udid]: [string, string, string]): Promise<Message> {
		if (msg.channel instanceof TextChannel) {
			msg.delete();
			msg.author.send('Send the verify command here.')
				.catch(() => { /* noop */ });
			return msg.reply('Please send your verification infomation to me directly in a DM. For more information <https://ud-cis-discord.github.io/verify/>.');
		}

		const udcis = this.client.guilds.cache.get('744982373300437627');
		if (!udcis.members.cache.has(msg.author.id)) throw 'You must be a member of the UDCIS Server to use this command!';
		if (!email.endsWith('@udel.edu')) throw `${email} is not a valid udel.edu email address`;
		if (udid.match(/[0-9]{9}/) === null || udid.length > 9) throw `${udid} is not a valid UDID`;

		await msg.author.settings.update(UserSettings.Details.Name, name);
		await msg.author.settings.update(UserSettings.Details.Email, email);
		await msg.author.settings.update(UserSettings.Details.UDID, udid);

		const trusted = udcis.roles.cache.get(udcis.settings.get(GuildSettings.Roles.Trusted));
		const member = udcis.members.cache.get(msg.author.id);

		if (trusted !== null && !member.roles.cache.has(trusted.id)) {
			member.roles.add(trusted);
		}

		const log = udcis.channels.cache.get(udcis.settings.get(GuildSettings.Channels.Memberlog)) as TextChannel;
		const embed = newEmbed()
			.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
			.setColor(Colors.Orange)
			.setTitle(`${msg.author.tag} has been verified`)
			.setTimestamp(Date.now())
			.addFields([
				{ name: 'Name', value: name, inline: true },
				{ name: 'Email', value: email, inline: true },
				{ name: 'UDID', value: udid, inline: true }
			]);
		log.send(embed);

		return msg.channel.send(`You have been verified as\nName: ${name}, Email: ${email}, UDID: ${udid}`);
	}

}
