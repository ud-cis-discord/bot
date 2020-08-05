import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message } from 'discord.js';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { Levels } from '@lib/types/levels';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Lets you check your level',
			aliases: ['check'],
			runIn: ['text']
		});
	}

	public async run(msg: KlasaMessage): Promise<Message> {
		const levels: Levels[] = msg.guild.settings.get(GuildSettings.Levels);
		if(levels.filter(u => u.user == msg.author.id).length == 0) {
			return msg.channel.send('It looks like you have no levels');
		} return msg.channel.send(`You have ${levels[levels.slice().map(u => u.user).indexOf(msg.author.id)].level} levels`);

	}

}
