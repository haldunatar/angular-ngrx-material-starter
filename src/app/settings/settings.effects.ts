import { Injectable } from '@angular/core';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, withLatestFrom } from 'rxjs/operators';

import { LocalStorageService, AnimationsService } from '@app/core';

import { SettingsActionTypes, SettingsActions } from './settings.actions';
import { selectSettings } from './settings.selectors';
import { State } from './settings.model';

export const SETTINGS_KEY = 'SETTINGS';

@Injectable()
export class SettingsEffects {
  constructor(
    private actions$: Actions<Action>,
    private localStorageService: LocalStorageService,
    private animationsService: AnimationsService,
    private store: Store<State>
  ) {}

  @Effect({ dispatch: false })
  persistSettings = this.actions$.pipe(
    ofType<SettingsActions>(
      SettingsActionTypes.CHANGE_LANGUAGE,
      SettingsActionTypes.CHANGE_THEME,
      SettingsActionTypes.CHANGE_AUTO_NIGHT_AUTO_MODE,
      SettingsActionTypes.CHANGE_STICKY_HEADER,
      SettingsActionTypes.CHANGE_ANIMATIONS_PAGE,
      SettingsActionTypes.CHANGE_ANIMATIONS_ELEMENTS
    ),
    withLatestFrom(this.store.pipe(select(selectSettings))),
    tap(([actions, settingsState]) => {
      const { pageAnimations, elementsAnimations } = settingsState;
      this.localStorageService.setItem(SETTINGS_KEY, settingsState);

      this.animationsService.updateRouteAnimationType(
        pageAnimations,
        elementsAnimations
      );
    })
  );
}
