# How to Git
This document is intended to make clear how we use Git in this project and provide some "how to" on regular operations.

## How we use Git
We never work directly against the master branch(Except for when we update our Rapport). When bug fixing, implementing new features or editing existing ones we instead create a new branch for this.
Naming conventions makes it easy to know what this branch is supposed to do. A bug fix can be named `fix/BugName`, a new feature 
`feat/FeatName` and changes to a feature `FeatName/ChangeName`. We should strive to always keep the purpose of a branch
simple and clear. The goal of a branch should be to change one thing and not many (If there are several things to do 
which do not relate to each other create a separate branch for each of these).

When a new feature/fix/feature change have been implemented in a seperate branch we do a <strong>Pull Request</strong> with
this feature. If there are no merge conflicts we can pull it into the master branch and delete the branch. If the change is non-trivial
it is good to have someone else review your code and testing the change before pulling it into the master branch and deleting
the temporary branch. You can assign people to review you code on the pull request page.

## Regular Operations
I assume you have Git installed and can run Git commands in the terminal.

### Getting started
Getting started with the project (as all of you have done now) is done by simply entering:

`git clone https://github.com/hotpucko/rcm-sommar-2019.git` 

This will create a local folder with the project.

### Seeing the status of the git project
Entering:

`git status`

Will display information such as current branch, which files are untracked/tracked and which files are added for a commit. This
command is useful to see that you're not about to commit any unwanted files or if you want to get a status update on what 
you was working on last.

### Starting a new branch
A new branch can be created by:

`git checkout -b 'branchName'`

This will create a new branch <i>locally</i>. Before creating a new branch make sure that you have the latest version of 
the master branch by:

```
git checkout master
git pull
```

### Change to another branch
Changing to another branch can be done by:

`git checkout 'branchName'`

I.e. changing to master branch:

`git checkout 'master'`

### Making a commit on a branch
Do `git status` to see which files you can commit. If you want to add all files to a commit do:

`git add .`

This will add all the files, you can also add files individually if you don't want to add all the files. Make commit by doing:

`git commit -m 'Message describing commit'`

In general it is good to make many small commits rather than one big one at the end. Try to get in the habit of doing this as
it will make the code easier to overview.

### Pushing local branch to repository
When you feel like you are done or just want your branch to be available on the repository do:

`git push`

If this branch do not exist on the repository this will result in an error and a suggestion on what you want to write to push
this branch to the repository. Copy and paste that to push the local branch.

### Making a Pull Request(PR)
When the branch exists on the repository and it's ready to be reviewed and potentially pulled into the master branch you can 
create a PR. This is done by going to your branch on GitHub and simply clicking `New Pull Request` button. Enter a description
for the PR and add reviewers.

### More Useful Commands(google how to use these)
* `git checkout` can be used remove all changes, go to a previous commit via a commit hash, ... .
* `git stash` can stash changes you've made and then reapply them.
* `git rebase` a more advanced git command. This command can change what this branch is based on. Useful for cases where
a PR has been made changing the master branch while you have been working on your branch and resulting in merge conflicts
for your branch since the master branch you base your branch on is old. I strongly recommend looking at
a tutorial and getting a good understanding of this command before using it.
