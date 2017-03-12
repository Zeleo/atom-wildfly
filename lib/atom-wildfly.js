'use babel';

import AtomWildflyView from './atom-wildfly-view';
import { CompositeDisposable } from 'atom';
import { BufferedProcess } from 'atom';

export default {

  atomWildflyView: null,
  bottomPanel: null,
  subscriptions: null,
  serverProcess: null,

  activate(state) {
    this.atomWildflyView = new AtomWildflyView(state.atomWildflyViewState);

    this.bottomPanel = atom.workspace.addBottomPanel({
      item: this.atomWildflyView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-wildfly:run': () => this.run(),
      'atom-wildfly:stop': () => this.stopServer(false),
      'atom-wildfly:restart': () => this.stopServer(true),
      'atom-wildfly:start': () => this.reStartServer(),
      'atom-wildfly:clear': () => this.clearOutput(),
      'atom-wildfly:toggle': () => this.togglePanel(),
      'atom-wildfly:toggleConsole': () => this.toggleLog(),
      'atom-wildfly:kill': () => this.killServer()
    }));

    this.atomWildflyView.getToggleButton().onclick = this.handleToggleLog;
    this.atomWildflyView.getStopButton().onclick = this.handleStopServer;
    this.atomWildflyView.getStartButton().onclick = this.handleStartServer;
    this.atomWildflyView.getRestartButton().onclick = this.handleRestartServer;
    this.atomWildflyView.getKillButton().onclick = this.handleKillServer;
    this.atomWildflyView.getClearConsoleButton().onclick = this.handleClearConsole;
    this.atomWildflyView.getSettingsButton().onclick = this.handleSettings;
    this.atomWildflyView.getHideButton().onclick = this.handleHide;
  },

  deactivate() {
    this.bottomPanel.destroy();
    this.subscriptions.dispose();
    this.atomWildflyView.destroy();
    if(this.serverProcess !== null) {
      this.serverProcess.kill();
    }
  },

  serialize() {
    return {
      atomWildflyViewState: this.atomWildflyView.serialize()
    };
  },

  run() {
    console.log('AtomWildfly was toggled!');
    this.startServer();
    return (
      this.bottomPanel.isVisible() ?
      this.bottomPanel.hide() :
      this.bottomPanel.show()
    );
  },

  getJbossHome() {
    console.log(process.env.JBOSS_HOME);
    return process.env.JBOSS_HOME;
  },

  startServer() {
    //this.runCommand('dir', '', (code) => {console.log(code);}, (data) => this.handleOutput(data), (data) => {console.error(data);});;
    this.runCommand(this.getJbossHome() + '/bin/standalone', [], (code) => {console.log(code);}, (data) => this.handleOutput(data), (data) => {console.error(data);});
  },

  handleOutput(data) {
    let area = this.atomWildflyView.getOutput();
    let container = this.atomWildflyView.getOutputContainer();
    data = this.styleText(data);
    area.innerHTML = area.innerHTML + data;
    container.scrollTop = container.scrollHeight;
  },

  clearOutput() {
    let area = this.atomWildflyView.getOutput();
    let container = this.atomWildflyView.getOutputContainer();
    area.innerHTML = '';
    container.scrollTop = container.scrollHeight;
  },

  styleText(data) {
    console.log(data);
    data = data.replace(/(?:\r\n|\r|\n)/g, '<br />');
    data = data.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    data = data.replace(/ INFO */g, '<span class="atom-wildfly-info">' + '\$&' + '</span>');
    data = data.replace(/ ERROR */g, '<span class="atom-wildfly-error">' + '\$&' + '</span>');
    data = data.replace(/ WARN */g, '<span class="atom-wildfly-warn">' + '\$&' + '</span>');
    data = data.replace(/[^\[\]]+(?=\])/g, '<span class="atom-wildfly-package">' + '\$&' + '</span>')
    data = data.replace(/\(([^()]+)\)/g, '<span class="atom-wildfly-thread">' + '\$&' + '</span>')
    data = data.replace(/\d\d:\d\d:\d\d,\d+/g, '<span class="atom-wildfly-timestamp">' + '\$&' + '</span>')
    return data;
  },

  runCommand (command, args, exit, stdout = {}, stderr = {}, options = {}) {
    if(this.serverProcess === null) {
      this.serverProcess = new BufferedProcess({command, args, options, stdout, stderr, exit})
    }
    else if(!this.serverProcess.started) {
      this.serverProcess.start();
    }
    else {
      console.log('Server has already been started.');
      console.debug(this.serverProcess);
    }
  },

  killServer() {
    console.debug(this);
    if(this.serverProcess != null && this.serverProcess.started) {
      this.serverProcess.kill();
      if(this.serverProcess.killed) {
        this.serverProcess = null;
        this.handleOutput('Server process killed successfully.');
      }
    }
    else {
      console.log('Server is not started.');
      console.debug(this.serverProcess);
    }
  },

  stopServer(restart) {
    console.debug(this.serverProcess);
    if(this.serverProcess != null && this.serverProcess.started) {
      process.env.NOPAUSE=true;
      let command = this.getJbossHome() + '/bin/jboss-cli';
      let shutdownCommand = '--command=:shutdown';
      if(restart) {
        shutdownCommand = shutdownCommand + '(restart=true)';
      }
      let args = ['--connect', 'controller=localhost:9991', shutdownCommand];
      let options = {};
      let logFunction = (data) => {console.log(data)};
      let stdout = (data) => this.handleStop(data, restart);
      this.stopProcess = new BufferedProcess({command, args, options, stdout, logFunction, logFunction});
      console.debug(this.stopProcess);
    }
    else {
      console.log('Server is not started.');
      console.debug(this.serverProcess);
    }
  },

  handleStop(data, restart) {
    console.debug(data);
    if(data.includes('success')) {
      this.stopProcess.kill();
      this.stopProcess = null;
      if(!restart) {
        this.serverProcess.kill();
        this.serverProcess = null;
        this.clearOutput();
      }
    }
  },

  reStartServer() {
    if(this.serverProcess === null) {
      this.runCommand(this.getJbossHome() + '/bin/standalone', [], (code) => {console.log(code);}, (data) => this.handleOutput(data), (data) => {console.error(data);});
    }
    else if(!this.serverProcess.started) {
      this.serverProcess.start();
    }
    else {
      console.log('Server is already running.');
      console.debug(this.serverProcess);
    }
  },

  togglePanel() {
    let output = this.atomWildflyView.getOutput();
    let outputArea = this.atomWildflyView.getOutputContainer();
    let panel = this.atomWildflyView.getElement();
    output.classList.toggle('atom-wildfly-hidden');
    outputArea.classList.toggle('atom-wildfly-hidden');
    panel.classList.toggle('atom-wildfly-hidden');
  },

  toggleLog() {
    this.togglePanel(this);
    let panel = this.atomWildflyView.getElement();
    panel.classList.toggle('atom-wildfly-hidden-toolbar');
  },

  handleToggleLog() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'atom-wildfly:toggleConsole');
  },

  handleStartServer() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'atom-wildfly:start');
  },

  handleStopServer() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'atom-wildfly:stop');
  },

  handleRestartServer() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'atom-wildfly:restart');
  },

  handleKillServer() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'atom-wildfly:kill');
  },

  handleClearConsole() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'atom-wildfly:clear');
  },

  handleSettings() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'atom-wildfly:settings');
  },

  handleHide() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'atom-wildfly:toggle');
  }
};
