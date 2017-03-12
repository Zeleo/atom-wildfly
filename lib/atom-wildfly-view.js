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
    this.element.appendChild(this.output);

    this.outputArea = document.createElement('div');
    this.outputArea.classList.add('atom-wildfly-output-area');
    this.outputArea.setAttribute('contenteditable', 'true');
    this.output.appendChild(this.outputArea);

    this.toggleButton = document.createElement('input');
    this.toggleButton.classList.add('atom-wildfly-button');
    this.toggleButton.setAttribute('type', 'button');
    this.toggleButton.value = 'Toggle Log';
    this.toolbar.appendChild(this.toggleButton);

    this.restartButton = document.createElement('input');
    this.restartButton.classList.add('atom-wildfly-button');
    this.restartButton.setAttribute('type', 'button');
    this.restartButton.value = 'Restart';
    this.toolbar.appendChild(this.restartButton);

    this.stopButton = document.createElement('input');
    this.stopButton.classList.add('atom-wildfly-button');
    this.stopButton.setAttribute('type', 'button');
    this.stopButton.value = 'Stop';
    this.toolbar.appendChild(this.stopButton);

    this.startButton = document.createElement('input');
    this.startButton.classList.add('atom-wildfly-button');
    this.startButton.setAttribute('type', 'button');
    this.startButton.value = 'Start';
    this.toolbar.appendChild(this.startButton);

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

  getOutput() {
    return this.outputArea;
  }

  getOutputContainer() {
    return this.output;
  }

}
