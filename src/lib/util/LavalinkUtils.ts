/* eslint-disable id-length */
export interface LavalinkEvent {
	op: string;
	type?: string;
	guildId: string;
}

export interface LavalinkEndEvent extends LavalinkEvent {
	track: string;
	reason: string;
}

export interface LavalinkExceptionEvent extends LavalinkEvent {
	track: string;
	error: string;
}

export interface LavalinkStuckEvent extends LavalinkEvent {
	track: string;
	thresholdMs: number;
}

export interface LavalinkWebSocketClosedEvent extends LavalinkEvent {
	code: number;
	reason: string;
	byRemote: boolean;
}

export interface LavalinkPlayerUpdateEvent extends LavalinkEvent {
	type: never;
	state: {
		time: number;
		position: number;
	};
}

export interface LavalinkDestroyEvent extends LavalinkEvent {
	type: never;
}

export function isTrackEndEvent(x: LavalinkEvent): x is LavalinkEndEvent {
	return x.type === 'TrackEndEvent';
}

export function isTrackExceptionEvent(x: LavalinkEvent): x is LavalinkExceptionEvent {
	return x.type === 'TrackExceptionEvent';
}

export function isTrackStuckEvent(x: LavalinkEvent): x is LavalinkStuckEvent {
	return x.type === 'TrackStuckEvent';
}

export function isWebSocketClosedEvent(x: LavalinkEvent): x is LavalinkWebSocketClosedEvent {
	return x.type === 'WebSocketClosedEvent';
}

export function isPlayerUpdate(x: LavalinkEvent): x is LavalinkPlayerUpdateEvent {
	return x.op === 'playerUpdate';
}

export function isDestroy(x: LavalinkEvent): x is LavalinkDestroyEvent {
	return x.op === 'destroy';
}
