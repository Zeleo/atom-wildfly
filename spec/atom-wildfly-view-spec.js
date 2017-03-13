'use babel';
/*jshint esversion: 6 */

import AtomWildflyView from '../lib/atom-wildfly-view';

describe('AtomWildflyView', () => {
  let atomWildflyView;

  beforeEach(() => {
    atomWildflyView = new AtomWildflyView();
  });

  it('should have valid getters', () => {
    expect(atomWildflyView.getElement()).toExist();
    expect(atomWildflyView.getToolbar()).toExist();
    expect(atomWildflyView.getOutput()).toExist();
    expect(atomWildflyView.getOutputContainer()).toExist();
    expect(atomWildflyView.getToggleButton()).toExist();
    expect(atomWildflyView.getStopButton()).toExist();
    expect(atomWildflyView.getStartButton()).toExist();
    expect(atomWildflyView.getRestartButton()).toExist();
    expect(atomWildflyView.getKillButton()).toExist();
    expect(atomWildflyView.getClearConsoleButton()).toExist();
    expect(atomWildflyView.getSettingsButton()).toExist();
    expect(atomWildflyView.getHideButton()).toExist();
  });

  it('should have the proper classes', () => {
    expect(atomWildflyView.getElement().classList.contains('atom-wildfly-output-panel')).toBe(true);
    expect(atomWildflyView.getToolbar().classList.contains('atom-wildfly-toolbar')).toBe(true);
    expect(atomWildflyView.getOutput().classList.contains('atom-wildfly-output-area')).toBe(true);
    expect(atomWildflyView.getOutputContainer().classList.contains('atom-wildfly-output')).toBe(true);
    expect(atomWildflyView.getToggleButton().classList.contains('atom-wildfly-button-left')).toBe(true);
    expect(atomWildflyView.getStopButton().classList.contains('atom-wildfly-button')).toBe(true);
    expect(atomWildflyView.getStartButton().classList.contains('atom-wildfly-button')).toBe(true);
    expect(atomWildflyView.getRestartButton().classList.contains('atom-wildfly-button')).toBe(true);
    expect(atomWildflyView.getKillButton().classList.contains('atom-wildfly-button')).toBe(true);
    expect(atomWildflyView.getClearConsoleButton().classList.contains('atom-wildfly-button')).toBe(true);
    expect(atomWildflyView.getSettingsButton().classList.contains('atom-wildfly-button-settings')).toBe(true);
    expect(atomWildflyView.getHideButton().classList.contains('atom-wildfly-button-right')).toBe(true);
  });

});
