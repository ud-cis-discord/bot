import { Monitor, MonitorStore, KlasaMessage } from 'klasa';
import { MessageReaction } from 'discord.js';

export default class extends Monitor {

	public constructor(store: MonitorStore, file: string[], directory: string) {
		super(store, file, directory, { ignoreOthers: false, ignoreEdits: false });
	}

	public async run(msg: KlasaMessage): Promise<MessageReaction | void> {
		if ((msg.content.toLocaleLowerCase().startsWith('thank') && msg.content.toLocaleLowerCase().match(/sage/))
		|| msg.content.toLocaleLowerCase().startsWith('sage thank')) {
			return msg.react('746236648282521711');
		}
		return;
	}

}
