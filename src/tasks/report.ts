import { Task } from 'klasa';
import { Message, TextChannel } from 'discord.js';
import { Levels } from '@lib/types/levels';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { formatDate } from '@lib/util/util';

export default class extends Task {

	public async run({ channel }): Promise<Message> {
		const _channel  = this.client.channels.cache.get(channel) as TextChannel;
		const _guild = _channel.guild;
		const levels: Levels[] = _guild.settings.get(GuildSettings.Levels);
		let buff: string = 'Display name,Messages sent\n';
		levels.forEach(level =>{
			buff += `${_guild.members.cache.get(level.user).displayName},${level.level}\n`;
		});
		const out = _channel.sendFile(Buffer.from(buff),`export_${formatDate(Date.now(), 'M-D-YY_HH-mm-ss')}.csv`);
		await _guild.settings.reset(GuildSettings.Levels);
		return out;
	}

}
