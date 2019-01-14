# atom-wildfly package

![Atom Wildfly](https://github.com/Zeleo/atom-wildfly/raw/master/images/Wildfly_Start.gif)

## Description

This Atom package allows you to run a Wildfly (formerly JBoss) Java Enterprise server within your editor. At this time, you will be able to fire up a server and view the log. The plugin also allows you to monitor archives and deploy them when they change. Eventually, debugging support in coordination with Java Atom packages will be implemented.

## Usage

When you first install the package, no UI changes will be noticeable. To turn on the Wildfly panel, you can either hit 'ctrl+alt+w' or Packages->Wildfly->Toggle Panel.

With the panel shown, you will see a console panel as well as a toolbar to control your server process.

### Toolbar Button Description

![Toolbar Detail](https://raw.githubusercontent.com/Zeleo/atom-wildfly/master/images/Wildfly_Output.png)

- Toggle Log

```
ctrl+alt+o
```
Toggle just the output console portion of the Wildfly panel. You will still be able to see the toolbar.

- Start Server

```
ctrl+alt+s
```
Start the Wildfly server. If the server already has started, the command will be ignored.

- Stop Server

```
ctrl+alt+x
```
Stop the server. This uses the jboss-cli to issues a stop command, as opposed to the kill option.

- Restart Server

```
ctrl+alt+r
```
Restart the Wildfly server. This only operates if the server has already been started. This also issues the command using the jboss-cli tool.

- Kill Server

```
ctrl+alt+k
```
Kill the server process. If all else fails, this will shut the server down the easy way.
- Clear Console

```
ctrl+alt+c
```
Clear the console output.
- Hide

```
ctrl+alt+w
```
Hides the entire panel, including the toolbar. You can show it again by hitting 'ctrl+alt+w' again, or selecting Packages->Wildfly->Toggle Panel

## Configuration

If you have your $JBOSS_HOME pointing at your Wildfly folder, this should just work. In case you don't or want to customize your setup, the following are available in the Settings dialog for the package.

![Settings Panel](https://raw.githubusercontent.com/Zeleo/atom-wildfly/master/images/Wildfly_Settings_Screenshot.png)

- Wildfly Home

This is the location of your root Wildfly folder. If you have your $JBOSS_HOME environment variable set, this will be used as a default, but you can alter that setting here.

- Configuration File

Your server configuration xml file. The default is standalone.xml, but you can specify another one as needed. Note, the Wilfly startup scripts require that this value be relative to your configuration folder, which defaults to {Wildfly Home}/standalone/configuration.

- Management Port

The jboss-cli communicates to your server through this port. By default it is 9990, but if you change it in your configuration xml, you will need to change it here as well.

- Start Command

If the name of the startup script is different than standalone.sh (or just standalone on Windows), define it here.

- Show Panel at Start

If this is checked the Wildfly panel will be visible when you launch Atom.

- Launch Server with Panel

If this is selected, the Wildfly server will boot as soon as you make the panel visible. If not, you will have to manually hit the Start command.

- Deployment Archives

Define folders or archives you want to deploy to your server. If you specify a folder, all valid archive types (war, jar, sar, ear) will be monitored and copied to the server deployment directory when the files are updated. If you specify the file just that file will be monitored. If you want to list several folders or files, separate them with a semicolon (';').

## General

This project is maintained by our company, [Zeleo, Inc](https://www.zeleo.io). We use open source technologies for our product, so we try to return the favor and give back to the community where possible. This is still a very young project and will have quite a few defects, but we will react to issues reported or Pull Requests created as quickly as possible.

I hope you enjoy the plugin, and hopefully it will become more useful as time goes on. Thanks for checking it out!
