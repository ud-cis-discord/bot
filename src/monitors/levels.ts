import { Monitor, MonitorStore, KlasaMessage } from 'klasa';
import { Message, TextChannel } from 'discord.js';
import { GuildSettings } from '@lib/types/settings/GuildSettings';

export default class extends Monitor {

	public constructor(store: MonitorStore, file: string[], directory: string) {
		super(store, file, directory, { ignoreOthers: false });
	}

	public async run(msg: KlasaMessage): Promise<Message | void> {
		const levels: Levels[] =  msg.guild.settings.get(GuildSettings.Levels);

		if(levels.filter(u => u.user == msg.author.id).length == 0) {
			const newUser : Levels = { user: msg.author.id, level: 1 };
			await msg.guild.settings.update(GuildSettings.Levels, newUser, { action: 'add' });
		} else {
			const levelsClone = levels.slice();
			const index = levelsClone.map(u => u.user).indexOf(msg.author.id);
			levelsClone[index].level++;
		}

		const _level = levels.filter(u => u.user === msg.author.id)[0];
		msg.channel.send(`User: ${_level.user} has sent ${_level.level} messages.`);
		return;
	}

}

interface Levels{
	user: string;
	level: number;
}