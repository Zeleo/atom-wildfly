'use babel';

import AtomWildflyView from './atom-wildfly-view';
import { CompositeDisposable } from 'atom';
import {BufferedProcess} from 'atom';

export default {

  atomWildflyView: null,
  bottomPanel: null,
  subscriptions: null,

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
      'atom-wildfly:run': () => this.run()
    }));

    this.atomWildflyView.getToggleButton().onclick = this.toggleLog;
  },

  deactivate() {
    this.bottomPanel.destroy();
    this.subscriptions.dispose();
    this.atomWildflyView.destroy();
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
    return new BufferedProcess({command, args, options, stdout, stderr, exit})
  },

  toggleLog() {
    let output = document.getElementById('wildfly-output-container');
    let outputArea = document.getElementById('wildfly-output-area');
    output.classList.toggle('atom-wildfly-hidden');
    outputArea.classList.toggle('atom-wildfly-hidden');
  }
};
