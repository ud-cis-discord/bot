import { Inhibitor, InhibitorStore, KlasaMessage } from 'klasa';

export default class extends Inhibitor {

	public constructor(store: InhibitorStore, file: string[], directory: string) {
		super(store, file, directory, { spamProtection: true });
	}

	public async run(msg: KlasaMessage): Promise<void> {
		if (msg.channel.type === 'dm') return;

		if (!msg.member.isAdmin && msg.content.match(/<@&[0-9]{18}>/)) {
			throw 'It looks like you are trying to inject a role ping. I\'m not going to let you do that';
		}
	}

}
