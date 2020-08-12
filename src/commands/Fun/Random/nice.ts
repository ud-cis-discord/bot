import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message } from 'discord.js';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: `Nice`
		});
	}

	public async run(msg: KlasaMessage): Promise<Message> {
		msg.react('👌');
		return;
	}

}
