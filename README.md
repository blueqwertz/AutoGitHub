# AutoGitHub

This Programm automates the process of creating a new Project

Features:

-   Select where you want to store your projects
-   Select Project name
-   Select different Settings for Repositories (Private, Issues, Wiki)
-   Auto `git init`
-   Auto `git push` to GitHub

### Important!

You have to install the GitHub CLI for this programm to work
(Without GitHub CLI it will only create a Folder in your Project Directory and init Git)
On Windows you have to install Scoop first:
`Set-ExecutionPolicy RemoteSigned -scope CurrentUser`
`iex (new-object net.webclient).downloadstring('https://get.scoop.sh')`

After installing scoop:
`gh auth login`
Select your Preferences and Login in your Browser
