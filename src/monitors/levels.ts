import { Monitor, MonitorStore, KlasaMessage } from 'klasa';
import { Message, TextChannel } from 'discord.js';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { Levels } from '@lib/types/levels';

export default class extends Monitor {

	public constructor(store: MonitorStore, file: string[], directory: string) {
		super(store, file, directory, { ignoreOthers: false });
	}

	public async run(msg: KlasaMessage): Promise<Message | void> {
		if(msg.member.roles.cache.has(msg.guild.settings.get(GuildSettings.Roles.NoLevels))) return;
		const noLevelchan : TextChannel[] = msg.guild.settings.get(GuildSettings.Channels.NoLevles);
		if(noLevelchan.filter(c => c == msg.channel).length > 0) return;

		const levels: Levels[] = msg.guild.settings.get(GuildSettings.Levels);

		if(levels.filter(u => u.user == msg.author.id).length == 0) {
			const newUser : Levels = { user: msg.author.id, level: 1 };
			await msg.guild.settings.update(GuildSettings.Levels, newUser, { action: 'add' });
		} else {
			const levelsClone = levels.slice();
			const index = levelsClone.map(u => u.user).indexOf(msg.author.id);
			levelsClone[index].level++;
			await msg.guild.settings.update(GuildSettings.Levels, levelsClone, { action: 'overwrite' });
		}
		
		return;
	}

}
