import React from 'react';
import { useConfiguring } from '../hooks/configuring';
import { useHeaderHidden } from '../hooks/header-hidden';
import { Action } from '../models/action';
import { Shortcut } from '../models/shortcut';
import { SuggestionMode } from '../models/suggestion-mode';
import { ActionButton } from './action-button';
import './header.scss';
import { LiveEntry } from './live-entry';
import { SuggestButton } from './suggest-button';

export function Header() {
    const [hidden, setHidden] = useHeaderHidden();
    const [configuring, setConfiguring] = useConfiguring();
    return (
        <header className={ hidden ? 'is-hidden' : '' }>
            <SuggestButton mode={ SuggestionMode.Verse } label="Verse" icon="fad fa-bible"/>
            <SuggestButton mode={ SuggestionMode.Person } label="Person" icon="fad fa-walking"/>
            <SuggestButton mode={ SuggestionMode.Custom } label="Custom" icon="fad fa-keyboard"/>

            <LiveEntry line="primary"/>
            <LiveEntry line="secondary"/>

            <ActionButton action={ Action.Show } icon="fad fa-eye" shortcut={ Shortcut.Enter }/>
            <ActionButton action={ Action.Hide } icon="fad fa-eye-slash" shortcut={ Shortcut.Escape }/>
            <ActionButton action={ Action.Save } icon="fad fa-save" shortcut={ Shortcut.CtrlS }/>

            <button className="hiding"
                    type="button"
                    onClick={ () => setHidden(!hidden) }><i
                className={ hidden ? 'fad fa-plus' : 'fad fa-minus' }/></button>
            { !hidden && <button className="configuring"
                                 type="button"
                                 onClick={ () => setConfiguring(!configuring) }><i
              className={ configuring ? 'fad fa-times-circle' : 'fad fa-cog' }/></button> }
        </header>
    );
}
