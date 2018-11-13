import { ActionSettingsChangeLanguage } from './settings.actions';
import { AnimationsService, LocalStorageService } from '@app/core';
import { Actions, getEffectsMetadata } from '@ngrx/effects';
import { cold } from 'jasmine-marbles';
import { EMPTY } from 'rxjs';
import { SettingsEffects, SETTINGS_KEY } from './settings.effects';
import { SettingsState, State } from './settings.model';
import { MockStore, provideMockStore } from '@testing/utils';
import { StoreModule, Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';

describe('SettingsEffects', () => {
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let animationsService: jasmine.SpyObj<AnimationsService>;
  let store: MockStore<State>;
  let state: State;

  const settings: SettingsState = {
    language: 'en',
    pageAnimations: true,
    elementsAnimations: true,
    theme: 'default',
    autoNightMode: false,
    stickyHeader: false,
    pageAnimationsDisabled: true
  };

  beforeEach(() => {
    localStorageService = jasmine.createSpyObj('LocalStorageService', [
      'setItem'
    ]);
    animationsService = jasmine.createSpyObj('AnimationsService', [
      'updateRouteAnimationType'
    ]);

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [provideMockStore()],
      declarations: []
    }).compileComponents();
    store = TestBed.get(Store);
    state = createState(settings);
    store.setState(state);
  });

  describe('persistSettings', () => {
    it('should not dispatch any action', () => {
      const actions = new Actions(EMPTY);
      const effect = new SettingsEffects(
        actions,
        localStorageService,
        animationsService,
        store
      );
      const metadata = getEffectsMetadata(effect);

      expect(metadata.persistSettings).toEqual({ dispatch: false });
    });
  });

  it('should call methods on AnimationsService and LocalStorageService for PERSIST action', () => {
    const persistAction = new ActionSettingsChangeLanguage({
      language: 'sk'
    });
    const source = cold('a', { a: persistAction });
    const actions = new Actions(source);
    const effect = new SettingsEffects(
      actions,
      localStorageService,
      animationsService,
      store
    );

    effect.persistSettings.subscribe(() => {
      expect(localStorageService.setItem).toHaveBeenCalledWith(
        SETTINGS_KEY,
        settings
      );
      expect(animationsService.updateRouteAnimationType).toHaveBeenCalledWith(
        true,
        true
      );
    });
  });
});

function createState(settingsState: SettingsState) {
  return {
    settings: settingsState
  } as State;
}
