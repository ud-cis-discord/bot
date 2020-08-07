import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message } from 'discord.js';
import { PermissionLevels } from '@lib/types/enums';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Sets the channel that reports will be sent to',
			extendedHelp: 'Only do this once or you will break things',
			requiredPermissions: PermissionLevels.OWNER
		});
	}

	public async run(msg: KlasaMessage): Promise<Message> {
		this.client.schedule.create('report','0 0 * * SUN,MON,TUE,WED,THU,FRI,SAT', {data: { channel: msg.channel.id }});
		return msg.channel.send('Setting this channel as where reports will be automaticly sent. **ONLY DO THIS ONCE BECAUSE BEN COULDNT BE BOTHERED TO MAKE IT NOT BREAK IF DONE MORE THAN ONCE** ');
	}

}
