import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message } from 'discord.js';
import { PermissionLevels } from '@lib/types/enums';
import { Levels } from '@lib/types/levels';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { formatDate } from '@lib/util/util';
import { UserSettings } from '@lib/types/settings/UserSettings';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Generates a report of user messages',
			aliases: ['export', 'getcsv'],
			permissionLevel: PermissionLevels.ADMINISTRATOR,
			runIn: ['text']
		});
	}

	public async run(msg: KlasaMessage): Promise<Message> {
		const levels: Levels[] = msg.guild.settings.get(GuildSettings.Levels);
		let buff = 'Name,Display name,Messages sent,Email,UDID,Roles\n';
		levels.forEach(level => {
			const member = msg.guild.members.cache.get(level.user);
			buff += `${member.user.settings.get(UserSettings.Details.Name)},${member.displayName},${level.level},` +
			`${member.user.settings.get(UserSettings.Details.Email)},${member.user.settings.get(UserSettings.Details.UDID)},"`;
			msg.guild.members.cache.get(level.user).roles.cache.array().forEach(role => { buff += `${role.name}, `; });
			buff += '"\n';
		});

		return msg.channel.sendFile(Buffer.from(buff), `export_${formatDate(Date.now(), 'M-D-YY_HH-mm-ss')}.csv`, 'Don\'t forget to reset all levels');
	}

}
