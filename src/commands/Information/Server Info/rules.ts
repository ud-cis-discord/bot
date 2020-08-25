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
		'We encourage you to help each other! However, saying  things like "It works on my machine" or "I don\'t have the problem" isn\'t helpful.',
		'Please keep to relevant channel topics, and if a Staff member or Admin asks you to move your conversation, listen.',
		'Don\'t spam. Don\'t spam emojis, pictures, messages, pings, etc. Just don\'t spam.',
		'Racist and discriminatory comments will not be tolerated. Comments like these will result in an instant ban, a report to Discord\'s Trust' +
		' and Safety team, and potential University actions.',
		'Keep your language appropriate- don\'t say something you wouldn\'t say to your professor.',
		'Make sure to get yourself verified. Instructions on how to do so can be found on our website at https://ud-cis-discord.github.io/verify/',
		'Respect what the Staff and Admins say, they are in charge for a reason. If they tell you to stop, then stop.',
		'The UD Code of Conduct applies to all activity on this server. For more information refer to the following link:' +
		' http://www1.udel.edu/stuguide/19-20/code.html',
		'Failure to follow any of the rules in your first 24 hours on the server will result in an instant ban.'
	];

	async all(msg: KlasaMessage): Promise<Message> {
		if (!msg.member.isAdmin) throw 'Sorry but you cant do that';

		msg.delete();

		let buff = '';
		this.rules.forEach((rule, idx) => {
			buff += `[${idx}] ${rule}\n`;
		});

		await msg.channel.send({ files: [{ attachment: './assets/images/rules.png', name: 'rules.png' }] });
		await msg.channel.send('Check out our website! <https://ud-cis-discord.github.io/>');
		return msg.sendCode('ini', buff);
	}

	async view(msg: KlasaMessage, ruleNum: number): Promise<Message> {
		if (this.rules[ruleNum] === undefined) throw 'Please provide a rule number.';
		if (ruleNum >= this.rules.length) throw `There is no rule ${ruleNum}.`;
		return msg.channel.send(`**Rule ${ruleNum}**\n${this.rules[ruleNum]}`);
	}

}
