import React from 'react';
import { useConfiguring } from '../hooks/configuring';
import { usePassword, useUsername } from '../hooks/credentials';
import { SetDisplaySettings, useDisplaySettings } from '../hooks/displays';
import { useBooks, useNames } from '../hooks/suggestion';
import { boxesAreEqual, DisplayMode, IConfiguredDisplay, IDisplay } from '../models/configured-display';
import './config.scss';

declare const electron: any;

export function Config() {
	const [configuring, setConfiguring] = useConfiguring();
	const [names, setNames] = useNames();
	const [books, setBooks] = useBooks();
	const [username, setUsername] = useUsername();
	const [password, setPassword] = usePassword();
	const [displaySettings, setDisplaySettings] = useDisplaySettings();
	if (!configuring) {
		return null;
	}
	const screen = electron.remote.screen;
	const displays = screen.getAllDisplays().sort((a: any, b: any) => a.bounds.x - b.bounds.x);
	return (
		<dialog className="config">
			<h1>Config</h1>
			<button className="configuring"
			        type="button"
			        onClick={() => setConfiguring(false)}><i
				className="fad fa-times-circle" /></button>

			<h2>Suggestions</h2>
			<div className="contents">
				<textarea value={names} onChange={e => setNames(e.target.value)} />
				<textarea value={books} onChange={e => setBooks(e.target.value)} />
			</div>

			<h2>Cerevo</h2>
			<div className="contents">
				<input placeholder="Username" type="email" name="username" value={username}
				       onChange={e => setUsername(e.target.value)} />
				<input placeholder="Password" type="password" name="password" value={password}
				       onChange={e => setPassword(e.target.value)} />
			</div>

			<h2>Displays</h2>
			<div className="displays">
				{displays.map((display: IDisplay, index: number) =>
					<div className="display"
					     style={calculateDisplayStyles(index, display, displays)}
					     key={display.id}>
						<div className="id">
							{display.id}
						</div>
						<select name="displayRole"
						        value={findDisplaySetting(display, displaySettings)}
						        onChange={e => saveDisplaySettings(e.target.value as DisplayMode, display, displaySettings, setDisplaySettings)}>
							<option value={DisplayMode.None}>None</option>
							<option value={DisplayMode.Key}>Key</option>
							<option value={DisplayMode.Fill}>Fill</option>
						</select>
					</div>)}
			</div>

		</dialog>
	);
}

function findDisplaySetting(display: IDisplay, displaySettings: IConfiguredDisplay[]) {
	const displaySetting = displaySettings.find(ds => boxesAreEqual(display.bounds, ds));
	return displaySetting ? displaySetting.mode : DisplayMode.None;
}

function saveDisplaySettings(mode: DisplayMode, display: IDisplay, displaySettings: IConfiguredDisplay[], setDisplaySettings: SetDisplaySettings) {
	const newSettings = displaySettings
		.slice()
		.filter(ds => ds.mode !== mode && !boxesAreEqual(display.bounds, ds));
	if (mode !== DisplayMode.None) {
		newSettings.push({
			mode,
			...display.bounds,
		});
	}
	setDisplaySettings(newSettings);
}

function calculateDisplayStyles(index: number, display: IDisplay, allDisplays: IDisplay[]) {
	const topAndBottom = 12;
	const leftAndRight = 24;
	const scrollBar = 12;
	const shrink = 0.01;

	const availableHeight = 160 - topAndBottom * 2;
	const availableWidth = window.innerWidth
		- leftAndRight * 2
		- scrollBar;

	const leftMostPoint = allDisplays.reduce((lowest: number, d: IDisplay) => Math.min(lowest, d.bounds.x), 0);
	const topMostPoint = allDisplays.reduce((lowest: number, d: IDisplay) => Math.min(lowest, d.bounds.y), 0);
	const rightMostPoint = allDisplays.reduce((highest: number, d: IDisplay) => Math.max(highest, d.bounds.x + d.bounds.width), 0);
	const bottomMostPoint = allDisplays.reduce((highest: number, d: IDisplay) => Math.max(highest, d.bounds.y + d.bounds.height), 0);
	const totalWidth = rightMostPoint - leftMostPoint;
	const totalHeight = bottomMostPoint - topMostPoint;

	const relativeLeft = display.bounds.x - leftMostPoint;
	const left = leftAndRight + relativeLeft / totalWidth * availableWidth + shrink * availableWidth;

	const relativeTop = display.bounds.y - topMostPoint;
	const top = topAndBottom + relativeTop / totalHeight * availableHeight + shrink * availableHeight;

	// TODO: Need to maintain aspect ratios.
	const width = display.bounds.width / totalWidth * availableWidth * (1 - shrink);
	const height = display.bounds.height / totalHeight * availableHeight * (1 - shrink);

	return { width, height, top, left };
}
