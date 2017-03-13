# atom-wildfly package

## Description

This Atom package allows you to run a Wildfly (formerly JBoss) Java Enterprise server within your editor. At this time, you will be able to fire up a server and view the log. The next step will deploy Java packages when they are built. Eventually, debugging support in coordination with Java Atom packages will be implemented.

## Usage

When you first install the package, no UI changes will be noticeable. To turn on the Wilfly panel, you can either hit 'ctrl+alt+w' or Packages->Wildfly->Toggle Panel.

With the panel shown, you will see a console panel as well as a toolbar to control your server process.

### Toolbar Button Description
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

