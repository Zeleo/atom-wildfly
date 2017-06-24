'use babel';
/*jshint esversion: 6 */

import AtomWildflyView from './atom-wildfly-view';
import { CompositeDisposable } from 'atom';
import { BufferedProcess } from 'atom';
var watch = require('node-watch');

export default {

  atomWildflyView: null,
  bottomPanel: null,
  subscriptions: null,
  serverProcess: null,

  config: {
    "wildflyHome": {
      "description": "Specify your Wildfly installation, if $JBOSS_HOME isn't set (or if you want to override).",
      "type": "string",
      "default": process.env.JBOSS_HOME
    },
    "configurationFile": {
      "description": "Specify your Wildfly configuration file if it isn't the default standalone.xml. Note- this is relative to the configuration directory, which by default is [Wildfly Home]/standalone/configuration/",
      "type": "string",
      "default": 'standalone.xml'
    },
    "startCommand": {
      "description": "This is the path and command that is issued to start the server. The initial directory is your Wildfly Home.",
      "type": "string",
      "default": process.platform === 'win32' ? '/bin/standalone' : '/bin/standalone.sh'
    },
    "managementPort": {
      "description": "If your management port is something other than the default (9990), specify here.",
      "type": "integer",
      "default": 9990
    },
    "showPanelAtStart": {
      "description": "Have the Wildfly Toolbar available when you launch Atom.",
      "type": "boolean",
      "default": false
    },
    "launchServerWithPanel": {
      "description": "Start Wildfly when you show the panel.",
      "type": "boolean",
      "default": false
    },
    "deploymentArchives": {
      "description": "A semicolon delimited (';') list of deployment archives (war, ear, jar) or folders containing them to monitor. When these files are updated, they will automaticatally be redeployed to your server. '[root]' will be replaced by the currently open root folder in Atom. If the entry is a folder, all valid archives within will be monitored.",
      "type": "string",
      "default": "[root]/build/libs"
    }
  },

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
      'atom-wildfly:kill': () => this.killServer(),
      'atom-wildfly:settings' : () => this.editSettings()
    }));

    this.atomWildflyView.getToggleButton().onclick = this.handleToggleLog;
    this.atomWildflyView.getStopButton().onclick = this.handleStopServer;
    this.atomWildflyView.getStartButton().onclick = this.handleStartServer;
    this.atomWildflyView.getRestartButton().onclick = this.handleRestartServer;
    this.atomWildflyView.getKillButton().onclick = this.handleKillServer;
    this.atomWildflyView.getClearConsoleButton().onclick = this.handleClearConsole;
    this.atomWildflyView.getSettingsButton().onclick = this.handleSettings;
    this.atomWildflyView.getHideButton().onclick = this.handleHide;

    if(this.getConfigValue('atom-wildfly.showPanelAtStart')) {
      this.run();
    }

    this.watchFiles();
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
    if(this.getConfigValue('atom-wildfly.launchServerWithPanel') && !this.bottomPanel.isVisible()) {
      this.startServer();
    } else {
      this.toggleLog();
    }
    return (
      this.bottomPanel.isVisible() ?
      this.bottomPanel.hide() :
      this.bottomPanel.show()
    );
  },

  watchFiles() {
    let paths = [];
    let configPaths = this.getConfigValue('atom-wildfly.deploymentArchives').split(';');
    var fs = require('fs.extra');
    for(var x = 0; x < atom.project.rootDirectories.length; x++) {
      for(var y = 0; y < configPaths.length; y++) {
          // Test if the path exists.
          var folderPath = configPaths[y].trim().replace(/\[root\]/g, atom.project.rootDirectories[x].path);
          if(fs.existsSync(folderPath)) {
            console.log('Watching folder: ' + folderPath);
            paths.push(folderPath);
          }
      }
    }
    watch(paths, { recursive: false }, function(evt, name) {
      var wildfly = require('./atom-wildfly');
      var fs = require('fs.extra');
      const path = require('path');
      let options = {};
      let destination = atom.config.get('atom-wildfly.wildflyHome') + '/standalone/deployments/'
      destination = destination + path.sep + path.basename(name);
      if(evt === 'update' && (name.endsWith('war') || name.endsWith('jar') || name.endsWith('ear') || name.endsWith('sar'))) {
        atom.notifications.addInfo(path.basename(name) + ' is being deployed to Wildfly.', options);
        fs.copy(name, destination, {replace: true}, (err) => {
          if(err) {
            console.error(err);
            atom.notifications.addError(err);
            return
          }
          else {
            atom.notifications.addSuccess('Successfully deployed archive: ' + path.basename(name));
          }
        })
      }
      else if(evt === 'remove' && (name.endsWith('war') || name.endsWith('jar') || name.endsWith('ear') || name.endsWith('sar'))) {
        atom.notifications.addInfo('Undeploying archive: ' + path.basename(name), options);
        fs.unlink(destination, (error) => {
          if(error) {
            console.error(error);
            atom.notifications.addError(error);
          }
          else {
            atom.notifications.addSuccess('Successfully undeployed archive: ' + path.basename(name));
          }
        });
      }
    });
  },

  getJbossHome() {
    console.log(process.env.JBOSS_HOME);
    return this.getConfigValue('atom-wildfly.wildflyHome');
  },

  getServerCommand() {
    console.log(this.getJbossHome() + this.getConfigValue('atom-wildfly.startCommand'));
    return this.getJbossHome() + this.getConfigValue('atom-wildfly.startCommand');
  },

  startServer() {
    this.showLog();
    let config = '--server-config=' + this.getConfigValue('atom-wildfly.configurationFile');
    this.runCommand(this.getServerCommand(), [config], (code) => {console.log(code);}, (data) => this.handleOutput(data), (data) => {console.error(data);});
  },

  handleOutput(data) {
    let area = this.atomWildflyView.getOutput();
    let container = this.atomWildflyView.getOutputContainer();
    data = this.styleText(data);
    area.innerHTML = area.innerHTML + data;
    if(container.scrollHeight > 10000) {
      this.clearOutput();
    }
    container.scrollTop = container.scrollHeight;
  },

  clearOutput() {
    let area = this.atomWildflyView.getOutput();
    let container = this.atomWildflyView.getOutputContainer();
    area.innerHTML = '';
    container.scrollTop = container.scrollHeight;
  },

  styleText(data) {
    //console.log(data);
    data = data.replace(/(?:\r\n|\r|\n)/g, '<br />');
    data = data.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    data = data.replace(/ INFO */g, '<span class="atom-wildfly-info">' + '\$&' + '</span>');
    data = data.replace(/ ERROR */g, '<span class="atom-wildfly-error">' + '\$&' + '</span>');
    data = data.replace(/ WARN */g, '<span class="atom-wildfly-warn">' + '\$&' + '</span>');
    data = data.replace(/[^\[\]]+(?=\])/g, '<span class="atom-wildfly-package">' + '\$&' + '</span>');
    data = data.replace(/\(([^()]+)\)/g, '<span class="atom-wildfly-thread">' + '\$&' + '</span>');
    data = data.replace(/\d\d:\d\d:\d\d,\d+/g, '<span class="atom-wildfly-timestamp">' + '\$&' + '</span>');
    return data;
  },

  runCommand (command, args, exit, stdout = {}, stderr = {}, options = {}) {
    if(this.serverProcess === null) {
      this.serverProcess = new BufferedProcess({command, args, options, stdout, stderr, exit});
    }
    else if(!this.serverProcess.started) {
      this.serverProcess.start();
    }
    else {
      console.log('Server has already been started.');
      this.handleOutput('<br/>Server has already been started.<br/>');
      console.debug(this.serverProcess);
    }
  },

  killServer() {
    console.debug(this);
    if(this.serverProcess !== null && this.serverProcess.started) {
      this.serverProcess.kill();
      if(this.serverProcess.killed) {
        this.serverProcess = null;
        this.handleOutput('<br/>Server process killed successfully.<br/>');
      }
    }
    else {
      console.log('Server is not started.');
      this.handleOutput('<br/>Server is not started.<br/>');
      console.debug(this.serverProcess);
    }
  },

  getConfigValue(config) {
    console.log(config);
    if(atom.config.get(config)) {
      return atom.config.get(config);
    }
    else {
      console.debug('Value not configured- returning the default value: ' + config);
      config = config.replace('atom-wildfly\.', '');
      return this.config[config].default;
    }
  },

  stopServer(restart) {
    console.debug(this.serverProcess);
    this.showLog();
    if(this.serverProcess !== null && this.serverProcess.started) {
      process.env.NOPAUSE=true;
      let command = this.getJbossHome() + '/bin/jboss-cli';
      if(process.platform !== 'win32') {
        command = command + '.sh';
      }
      let shutdownCommand = '--command=:shutdown';
      if(restart) {
        shutdownCommand = shutdownCommand + '(restart=true)';
      }
      let portCommand = 'controller=localhost:' + this.getConfigValue('atom-wildfly.managementPort');
      let args = ['--connect', portCommand, shutdownCommand];
      let options = {};
      let logFunction = (data) => {console.log(data);};
      let stdout = (data) => this.handleStop(data, restart);
      let stderr = (error) => atom.notifications.addError(error);
      this.stopProcess = new BufferedProcess({command, args, options, stdout, stderr, logFunction});
      console.debug(this.stopProcess);
    }
    else {
      console.log('Server is not started.');
      console.debug(this.serverProcess);
      this.handleOutput('<br/>Server is not started.<br/>');
    }
  },

  handleDeploy(data) {
    console.debug(data);
    if(data.includes('success')) {
      atom.notifications.addSuccess('Package deployed successfully.');
    };
  },

  editSettings() {
    console.debug(atom.config);
  },

  handleStop(data, restart) {
    console.debug(data);
    if(data.includes('success')) {
      this.stopProcess.kill();
      this.stopProcess = null;
      if(!restart) {
        this.serverProcess.kill();
        this.serverProcess = null;
      }
      else {
        this.clearOutput();
      }
    }
    else {
      atom.notifications.addError(data);
    }
  },

  reStartServer() {
    if(this.serverProcess === null) {
      let config = '--server-config=' + this.getConfigValue('atom-wildfly.configurationFile');
      this.showLog();
      this.runCommand(this.getServerCommand(), [config], (code) => {console.log(code);}, (data) => this.handleOutput(data), (error) => {atom.notifications.addError(error);});
    }
    else if(!this.serverProcess.started) {
      this.serverProcess = null;
      this.reStartServer();
    }
    else {
      console.log('Server is already running.');
      this.handleOutput('<br/>Server is already running.<br/>');
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

  showLog() {
    let output = this.atomWildflyView.getOutput();
    let outputArea = this.atomWildflyView.getOutputContainer();
    let panel = this.atomWildflyView.getElement();
    output.classList.remove('atom-wildfly-hidden');
    outputArea.classList.remove('atom-wildfly-hidden');
    panel.classList.remove('atom-wildfly-hidden');
    panel.classList.remove('atom-wildfly-hidden-toolbar');
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
