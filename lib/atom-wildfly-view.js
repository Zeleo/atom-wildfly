'use babel';

export default class AtomWildflyView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('atom-wildfly-output-panel');

    this.toolbar = document.createElement('div');
    this.toolbar.classList.add('atom-wildfly-toolbar');
    this.element.appendChild(this.toolbar);

    this.output = document.createElement('div');
    this.output.classList.add('atom-wildfly-output');
    this.output.setAttribute("id", "wildfly-output-container");
    this.element.appendChild(this.output);

    this.outputArea = document.createElement('div');
    this.outputArea.classList.add('atom-wildfly-output-area');
    this.output.setAttribute("id", "wildfly-output-area");
    this.outputArea.setAttribute('contenteditable', 'true');
    this.output.appendChild(this.outputArea);

    this.toggleButton = document.createElement('input');
    this.toggleButton.classList.add('atom-wildfly-button');
    this.toggleButton.classList.add('atom-wildfly-button-left');
    this.toggleButton.setAttribute('type', 'button');
    this.toggleButton.value = 'Toggle Log';
    this.toolbar.appendChild(this.toggleButton);

    this.startButton = document.createElement('input');
    this.startButton.classList.add('atom-wildfly-button');
    this.startButton.setAttribute('type', 'button');
    this.startButton.value = 'Start Server';
    this.toolbar.appendChild(this.startButton);

    this.stopButton = document.createElement('input');
    this.stopButton.classList.add('atom-wildfly-button');
    this.stopButton.setAttribute('type', 'button');
    this.stopButton.value = 'Stop Server';
    this.toolbar.appendChild(this.stopButton);

    this.restartButton = document.createElement('input');
    this.restartButton.classList.add('atom-wildfly-button');
    this.restartButton.setAttribute('type', 'button');
    this.restartButton.value = 'Restart Server';
    this.toolbar.appendChild(this.restartButton);

    this.killButton = document.createElement('input');
    this.killButton.classList.add('atom-wildfly-button');
    this.killButton.setAttribute('type', 'button');
    this.killButton.value = 'Kill Server';
    this.toolbar.appendChild(this.killButton);

    this.clearButton = document.createElement('input');
    this.clearButton.classList.add('atom-wildfly-button');
    this.clearButton.setAttribute('type', 'button');
    this.clearButton.value = 'Clear Console';
    this.toolbar.appendChild(this.clearButton);

    this.hideButton = document.createElement('input');
    this.hideButton.classList.add('atom-wildfly-button');
    this.hideButton.classList.add('atom-wildfly-button-right');
    this.hideButton.setAttribute('type', 'button');
    this.hideButton.value = 'Hide';
    this.toolbar.appendChild(this.hideButton);

    this.settingsButton = document.createElement('input');
    this.settingsButton.classList.add('atom-wildfly-button');
    this.settingsButton.classList.add('atom-wildfly-button-settings');
    this.settingsButton.setAttribute('type', 'button');
    this.settingsButton.value = 'Settings';
    this.toolbar.appendChild(this.settingsButton);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  getToolbar() {
    return this.toolbar;
  }

  getOutput() {
    return this.outputArea;
  }

  getOutputContainer() {
    return this.output;
  }

  getToggleButton() {
    return this.toggleButton;
  }

  getStopButton() {
    return this.stopButton;
  }

  getStartButton() {
    return this.startButton;
  }

  getRestartButton() {
    return this.restartButton;
  }

  getKillButton() {
    return this.killButton;
  }

  getClearConsoleButton() {
    return this.clearButton;
  }

  getSettingsButton() {
    return this.settingsButton;
  }

  getHideButton() {
    return this.hideButton;
  }

}
