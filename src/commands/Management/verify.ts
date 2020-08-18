import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message } from 'discord.js';
import { UserSettings } from '@lib/types/settings/UserSettings';
import { GuildSettings } from '@lib/types/settings/GuildSettings';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Get yourself verified',
			examples: ['verify Ben Segal | bensegal@udel.edu | 702425559'],
			extendedHelp: 'Provide your real name first, then your @udel.edu email, then your udid',
			runIn: ['text'],
			usage: '<name:string> <email:string> <udid:string>',
			helpUsage: 'Name | Email | UDID'
		});
	}

	public async run(msg: KlasaMessage, [name, email, udid]: [string, string, string]): Promise<Message> {
		if (!email.endsWith('@udel.edu')) throw `${email} is not a valid udel.edu email address`;
		if (udid.match(/[0-9]{9}/) === null || udid.length > 9) throw `${udid} is not a valid UDID`;

		await msg.author.settings.update(UserSettings.Details.Name, name);
		await msg.author.settings.update(UserSettings.Details.Email, email);
		await msg.author.settings.update(UserSettings.Details.UDID, udid);
		const trusted = msg.guild.roles.cache.get(msg.guild.settings.get(GuildSettings.Roles.Trusted));
		if (trusted !== null && !msg.member.roles.cache.has(trusted.id)) {
			msg.member.roles.add(trusted);
		}
		return msg.channel.send(`Updated your user details\nName: ${name}, Email: ${email}, UDID: ${udid}`);
	}

}
