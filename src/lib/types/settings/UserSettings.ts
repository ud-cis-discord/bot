/* eslint-disable @typescript-eslint/no-namespace */

export namespace UserSettings {

	export const EmbedColor = 'embedColor';

	export namespace Pomodoro {
		export const CurrentSegment = 'pomodoro.currentSegment';
		export const LongBreakTime = 'pomodoro.longBreakTime';
		export const Running = 'pomodoro.running';
		export const ShortBreakTime = 'pomodoro.shortBreakTime';
		export const WorkRoundNumber = 'pomodoro.workRoundNumber';
		export const WorkTime = 'pomodoro.workTime';
	}

	export namespace Details {
		export const Name = 'details.name';
		export const Email = 'details.email';
		export const UDID = 'details.udid';
	}

}
