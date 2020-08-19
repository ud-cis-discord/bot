import { Task } from 'klasa';
import { Message, TextChannel } from 'discord.js';
import { Levels } from '@lib/types/levels';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { formatDate } from '@lib/util/util';
import { UserSettings } from '@lib/types/settings/UserSettings';

export default class extends Task {

	public async run({ channel }): Promise<Message> {
		const _channel = this.client.channels.cache.get(channel) as TextChannel;
		const _guild = _channel.guild;
		const levels: Levels[] = _guild.settings.get(GuildSettings.Levels);

		let buff = 'Name,Display name,Messages sent,Email,UDID,Roles\n';
		levels.forEach(level => {
			const member = _guild.members.cache.get(level.user);
			buff += `${member.user.settings.get(UserSettings.Details.Name)},${member.displayName},${level.level},` +
			`${member.user.settings.get(UserSettings.Details.Email)},${member.user.settings.get(UserSettings.Details.UDID)},"`;
			_guild.members.cache.get(level.user).roles.cache.array().forEach(role => { buff += `${role.name}, `; });
			buff += '"\n';
		});
		const out = _channel.sendFile(Buffer.from(buff), `export_${formatDate(Date.now(), 'M-D-YY_HH-mm-ss')}.csv`, 'All levels have been reset');
		await _guild.settings.reset(GuildSettings.Levels);
		return out;
	}

}
