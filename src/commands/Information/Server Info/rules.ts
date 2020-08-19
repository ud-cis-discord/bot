import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message } from 'discord.js';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Display the rules',
			aliases: ['rule'],
			runIn: ['text'],
			subcommands: true,
			usage: '<all|view:default> (number:number)',
			helpUsage: 'rule number'
		});
		this
			.createCustomResolver('number', (num, possible, msg, [action]) => action !== 'all' ? num : null);
	}

	rules: string[] = [
		'Be respectful, there are no dumb questions.',
		'Your nickname should be your real name, especially if you want participation points!',
		'Don\'t spam. Don\'t spam emojis, pictures, messages, pings, etc. Just don\'t spam.',
		'Please keep to relevant channel topics, and if a Staff member or Admin asks you to move your conversation, listen.',
		'We encourage you to help each other! However, saying  things like "It works on my machine" or "I don\'t have the problem" isn\'t helpful.',
		'Keep your language clean- don\'t say something you wouldn\'t say to your professor.',
		'Make sure to read the [#useful-info] channel! As the name implies, there is useful info in there.',
		'Respect what the Staff and Admins say, they are in charge for a reason. If they tell you to stop, then stop.'
	];

	async all(msg: KlasaMessage): Promise<Message> {
		if (!msg.member.isAdmin) throw 'Sorry but you cant do that';
		msg.delete();
		let buff = '';
		this.rules.forEach((rule, idx) => {
			buff += `[${idx}] ${rule}\n`;
		});
		await msg.channel.send({ files: [{ attachment: './assets/images/rules.png', name: 'rules.png' }] });
		return msg.sendCode('ini', buff);
	}

	async view(msg: KlasaMessage, ruleNum: number): Promise<Message> {
		if (ruleNum >= this.rules.length) throw `There is no rule ${ruleNum}`;
		return msg.channel.send(this.rules[ruleNum]);
	}

}
