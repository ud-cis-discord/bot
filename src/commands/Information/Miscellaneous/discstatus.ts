import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message } from 'discord.js';
import { newEmbed, formatDate } from '@utils/util';
import { Colors } from '@lib/types/enums';
import request from 'request';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['discordstatus', 'isdiscordbroke'],
			cooldown: 60,
			cooldownLevel: 'channel',
			description: 'See the current status of Discord'
		});
	}

	public async run(msg: KlasaMessage): Promise<Message> {
		const url = 'https://srhpyqt94yxb.statuspage.io/api/v2/summary.json';
		const options = { json: true };

		request(url, options, (error, res, body) => {
			if (error) {
				return msg.channel.send('Failed to retireve status');
			}

			if (!error && res.statusCode === 200) {
				// do something with JSON, using the 'body' variable
				const embed = newEmbed()
					.setTitle(body.status.description)
					.setDescription('[Discord Status](https://status.discordapp.com)')
					.addFields(body.components.map(component => ({
						name: component.name,
						value: component.status,
						inline: true
					})))
					.setTimestamp()
					.setFooter(`Last changed: ${formatDate(body.page.updated_at)}`)
					.setColor(Colors.SpaceXBlue);

				return msg.channel.send(embed);
			}
		});
		return null;
	}

}
