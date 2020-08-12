import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { PermissionLevels } from '@lib/types/enums';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message } from 'discord.js';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Display the rules',
			permissionLevel: PermissionLevels.ADMINISTRATOR
		});
	}

	async run(msg: KlasaMessage): Promise<Message> {
		const rules : String[] = [
			'[0] Be respectful, There are no dumb questions.',
			'[1] Your nickname should be your real name, especially if you want participation points',
			'[2] Don\'t spam. Don\'t spam emojis, pictures, messages, pings. Just don\'t spam.',
			'[3] Please keep to channel topics, if a Staff member or Admin asks you to move your conversation, listen.',
			'[4] We encourage you to help each other but saying things like "It works on my machine" or "I don\'t have the problem" isn\'t helpful.',
			'[5] Keep your language clean, don\'t say something you wouldn\'t say to your professor.',
			'[6] Make sure to read the [#useful-info] channel, as the name inplies, there is useful info in there.',
			'[7] Respect what the Staff and Admins say, if they tell you to stop, then stop. '
		];
		msg.delete();
		await msg.channel.send({ files: [{ attachment: './assets/images/rules.png', name: 'rules.png' }] });
		return msg.sendCode('ini', rules.join('\n'));
	}

}
