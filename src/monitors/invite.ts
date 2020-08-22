import { Monitor, MonitorStore, KlasaMessage } from 'klasa';
import { Message, TextChannel } from 'discord.js';

export default class extends Monitor {

	public constructor(store: MonitorStore, file: string[], directory: string) {
		super(store, file, directory, { ignoreOthers: false, ignoreEdits: false });
	}

	public async run(msg: KlasaMessage): Promise<Message | void> {
		if (msg.channel instanceof TextChannel) {
			if (msg.content.match(/(discord\.gg|discordapp\.com\/invite)\/(.+)/)) {
				const inviteMsg = await msg.delete();

				inviteMsg.reply(`please do not post server invites publicly.`);
			}
		}

		return;
	}

}
