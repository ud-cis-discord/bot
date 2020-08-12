import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message } from 'discord.js';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['x'],
			description: 'Press X to doubt',
			examples: ['doubt']
		});
	}

	public async run(msg: KlasaMessage): Promise<Message> {
		msg.react('736267995663564830');
		return;
	}

}
