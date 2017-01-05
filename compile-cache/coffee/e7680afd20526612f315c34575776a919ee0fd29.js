(function() {
  var getCommands, git;

  git = require('./git');

  getCommands = function() {
    var GitBranch, GitCheckoutAllFiles, GitCheckoutFile, GitCherryPick, GitCommit, GitCommitAmend, GitDeleteLocalBranch, GitDeleteRemoteBranch, GitDiff, GitDiffAll, GitDifftool, GitFetch, GitFetchPrune, GitInit, GitLog, GitMerge, GitOpenChangedFiles, GitPull, GitPush, GitRebase, GitRemove, GitRun, GitShow, GitStageFiles, GitStageFilesBeta, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStashSaveMessage, GitStatus, GitTags, GitUnstageFiles;
    GitBranch = require('./models/git-branch');
    GitDeleteLocalBranch = require('./models/git-delete-local-branch');
    GitDeleteRemoteBranch = require('./models/git-delete-remote-branch');
    GitCheckoutAllFiles = require('./models/git-checkout-all-files');
    GitCheckoutFile = require('./models/git-checkout-file');
    GitCherryPick = require('./models/git-cherry-pick');
    GitCommit = require('./models/git-commit');
    GitCommitAmend = require('./models/git-commit-amend');
    GitDiff = require('./models/git-diff');
    GitDifftool = require('./models/git-difftool');
    GitDiffAll = require('./models/git-diff-all');
    GitFetch = require('./models/git-fetch');
    GitFetchPrune = require('./models/git-fetch-prune');
    GitInit = require('./models/git-init');
    GitLog = require('./models/git-log');
    GitPull = require('./models/git-pull');
    GitPush = require('./models/git-push');
    GitRemove = require('./models/git-remove');
    GitShow = require('./models/git-show');
    GitStageFiles = require('./models/git-stage-files');
    GitStageFilesBeta = require('./models/git-stage-files-beta');
    GitStageHunk = require('./models/git-stage-hunk');
    GitStashApply = require('./models/git-stash-apply');
    GitStashDrop = require('./models/git-stash-drop');
    GitStashPop = require('./models/git-stash-pop');
    GitStashSave = require('./models/git-stash-save');
    GitStashSaveMessage = require('./models/git-stash-save-message');
    GitStatus = require('./models/git-status');
    GitTags = require('./models/git-tags');
    GitUnstageFiles = require('./models/git-unstage-files');
    GitRun = require('./models/git-run');
    GitMerge = require('./models/git-merge');
    GitRebase = require('./models/git-rebase');
    GitOpenChangedFiles = require('./models/git-open-changed-files');
    return git.getRepo().then(function(repo) {
      var commands, currentFile, ref;
      currentFile = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
      git.refresh(repo);
      commands = [];
      if (atom.config.get('git-plus.experimental.customCommands')) {
        commands = commands.concat(require('./service').getCustomCommands());
      }
      commands.push([
        'git-plus:add', 'Add', function() {
          return git.add(repo, {
            file: currentFile
          });
        }
      ]);
      commands.push([
        'git-plus:add-modified', 'Add Modified', function() {
          return git.add(repo, {
            update: true
          });
        }
      ]);
      commands.push([
        'git-plus:add-all', 'Add All', function() {
          return git.add(repo);
        }
      ]);
      commands.push([
        'git-plus:log', 'Log', function() {
          return GitLog(repo);
        }
      ]);
      commands.push([
        'git-plus:log-current-file', 'Log Current File', function() {
          return GitLog(repo, {
            onlyCurrentFile: true
          });
        }
      ]);
      commands.push([
        'git-plus:remove-current-file', 'Remove Current File', function() {
          return GitRemove(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-all-files', 'Checkout All Files', function() {
          return GitCheckoutAllFiles(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-current-file', 'Checkout Current File', function() {
          return GitCheckoutFile(repo, {
            file: currentFile
          });
        }
      ]);
      commands.push([
        'git-plus:commit', 'Commit', function() {
          return GitCommit(repo);
        }
      ]);
      commands.push([
        'git-plus:commit-all', 'Commit All', function() {
          return GitCommit(repo, {
            stageChanges: true
          });
        }
      ]);
      commands.push([
        'git-plus:commit-amend', 'Commit Amend', function() {
          return GitCommitAmend(repo);
        }
      ]);
      commands.push([
        'git-plus:add-and-commit', 'Add And Commit', function() {
          return git.add(repo, {
            file: currentFile
          }).then(function() {
            return GitCommit(repo);
          });
        }
      ]);
      commands.push([
        'git-plus:add-and-commit-and-push', 'Add And Commit And Push', function() {
          return git.add(repo, {
            file: currentFile
          }).then(function() {
            return GitCommit(repo, {
              andPush: true
            });
          });
        }
      ]);
      commands.push([
        'git-plus:add-all-and-commit', 'Add All And Commit', function() {
          return git.add(repo).then(function() {
            return GitCommit(repo);
          });
        }
      ]);
      commands.push([
        'git-plus:add-all-commit-and-push', 'Add All, Commit And Push', function() {
          return git.add(repo).then(function() {
            return GitCommit(repo, {
              andPush: true
            });
          });
        }
      ]);
      commands.push([
        'git-plus:commit-all-and-push', 'Commit All And Push', function() {
          return GitCommit(repo, {
            stageChanges: true,
            andPush: true
          });
        }
      ]);
      commands.push([
        'git-plus:checkout', 'Checkout', function() {
          return GitBranch.gitBranches(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-remote', 'Checkout Remote', function() {
          return GitBranch.gitRemoteBranches(repo);
        }
      ]);
      commands.push([
        'git-plus:new-branch', 'Checkout New Branch', function() {
          return GitBranch.newBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:delete-local-branch', 'Delete Local Branch', function() {
          return GitDeleteLocalBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:delete-remote-branch', 'Delete Remote Branch', function() {
          return GitDeleteRemoteBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:cherry-pick', 'Cherry-Pick', function() {
          return GitCherryPick(repo);
        }
      ]);
      commands.push([
        'git-plus:diff', 'Diff', function() {
          return GitDiff(repo, {
            file: currentFile
          });
        }
      ]);
      commands.push([
        'git-plus:difftool', 'Difftool', function() {
          return GitDifftool(repo);
        }
      ]);
      commands.push([
        'git-plus:diff-all', 'Diff All', function() {
          return GitDiffAll(repo);
        }
      ]);
      commands.push([
        'git-plus:fetch', 'Fetch', function() {
          return GitFetch(repo);
        }
      ]);
      commands.push([
        'git-plus:fetch-prune', 'Fetch Prune', function() {
          return GitFetchPrune(repo);
        }
      ]);
      commands.push([
        'git-plus:pull', 'Pull', function() {
          return GitPull(repo);
        }
      ]);
      commands.push([
        'git-plus:push', 'Push', function() {
          return GitPush(repo);
        }
      ]);
      commands.push([
        'git-plus:push-set-upstream', 'Push -u', function() {
          return GitPush(repo, {
            setUpstream: true
          });
        }
      ]);
      commands.push([
        'git-plus:remove', 'Remove', function() {
          return GitRemove(repo, {
            showSelector: true
          });
        }
      ]);
      commands.push([
        'git-plus:reset', 'Reset HEAD', function() {
          return git.reset(repo);
        }
      ]);
      commands.push([
        'git-plus:show', 'Show', function() {
          return GitShow(repo);
        }
      ]);
      if (atom.config.get('git-plus.experimental.stageFilesBeta')) {
        commands.push([
          'git-plus:stage-files', 'Stage Files', function() {
            return GitStageFilesBeta(repo);
          }
        ]);
      } else {
        commands.push([
          'git-plus:stage-files', 'Stage Files', function() {
            return GitStageFiles(repo);
          }
        ]);
        commands.push([
          'git-plus:unstage-files', 'Unstage Files', function() {
            return GitUnstageFiles(repo);
          }
        ]);
      }
      commands.push([
        'git-plus:stage-hunk', 'Stage Hunk', function() {
          return GitStageHunk(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-save', 'Stash: Save Changes', function() {
          return GitStashSave(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-save-message', 'Stash: Save Changes With Message', function() {
          return GitStashSaveMessage(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-pop', 'Stash: Apply (Pop)', function() {
          return GitStashPop(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-apply', 'Stash: Apply (Keep)', function() {
          return GitStashApply(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-delete', 'Stash: Delete (Drop)', function() {
          return GitStashDrop(repo);
        }
      ]);
      commands.push([
        'git-plus:status', 'Status', function() {
          return GitStatus(repo);
        }
      ]);
      commands.push([
        'git-plus:tags', 'Tags', function() {
          return GitTags(repo);
        }
      ]);
      commands.push([
        'git-plus:run', 'Run', function() {
          return new GitRun(repo);
        }
      ]);
      commands.push([
        'git-plus:merge', 'Merge', function() {
          return GitMerge(repo);
        }
      ]);
      commands.push([
        'git-plus:merge-remote', 'Merge Remote', function() {
          return GitMerge(repo, {
            remote: true
          });
        }
      ]);
      commands.push([
        'git-plus:merge-no-fast-forward', 'Merge without fast-forward', function() {
          return GitMerge(repo, {
            noFastForward: true
          });
        }
      ]);
      commands.push([
        'git-plus:rebase', 'Rebase', function() {
          return GitRebase(repo);
        }
      ]);
      commands.push([
        'git-plus:git-open-changed-files', 'Open Changed Files', function() {
          return GitOpenChangedFiles(repo);
        }
      ]);
      return commands;
    });
  };

  module.exports = getCommands;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvZ2l0LXBsdXMtY29tbWFuZHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVI7O0VBRU4sV0FBQSxHQUFjLFNBQUE7QUFDWixRQUFBO0lBQUEsU0FBQSxHQUF5QixPQUFBLENBQVEscUJBQVI7SUFDekIsb0JBQUEsR0FBeUIsT0FBQSxDQUFRLGtDQUFSO0lBQ3pCLHFCQUFBLEdBQXlCLE9BQUEsQ0FBUSxtQ0FBUjtJQUN6QixtQkFBQSxHQUF5QixPQUFBLENBQVEsaUNBQVI7SUFDekIsZUFBQSxHQUF5QixPQUFBLENBQVEsNEJBQVI7SUFDekIsYUFBQSxHQUF5QixPQUFBLENBQVEsMEJBQVI7SUFDekIsU0FBQSxHQUF5QixPQUFBLENBQVEscUJBQVI7SUFDekIsY0FBQSxHQUF5QixPQUFBLENBQVEsMkJBQVI7SUFDekIsT0FBQSxHQUF5QixPQUFBLENBQVEsbUJBQVI7SUFDekIsV0FBQSxHQUF5QixPQUFBLENBQVEsdUJBQVI7SUFDekIsVUFBQSxHQUF5QixPQUFBLENBQVEsdUJBQVI7SUFDekIsUUFBQSxHQUF5QixPQUFBLENBQVEsb0JBQVI7SUFDekIsYUFBQSxHQUF5QixPQUFBLENBQVEsMEJBQVI7SUFDekIsT0FBQSxHQUF5QixPQUFBLENBQVEsbUJBQVI7SUFDekIsTUFBQSxHQUF5QixPQUFBLENBQVEsa0JBQVI7SUFDekIsT0FBQSxHQUF5QixPQUFBLENBQVEsbUJBQVI7SUFDekIsT0FBQSxHQUF5QixPQUFBLENBQVEsbUJBQVI7SUFDekIsU0FBQSxHQUF5QixPQUFBLENBQVEscUJBQVI7SUFDekIsT0FBQSxHQUF5QixPQUFBLENBQVEsbUJBQVI7SUFDekIsYUFBQSxHQUF5QixPQUFBLENBQVEsMEJBQVI7SUFDekIsaUJBQUEsR0FBeUIs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LENBQWpFO09BQWQ7TUFDQSxRQUFRLENBQUMsSUFBVCxDQUFjO1FBQUMsaUJBQUQsRUFBb0IsUUFBcEIsRUFBOEIsU0FBQTtpQkFBRyxTQUFBLENBQVUsSUFBVjtRQUFILENBQTlCO09BQWQ7TUFDQSxRQUFRLENBQUMsSUFBVCxDQUFjO1FBQUMsaUNBQUQsRUFBb0Msb0JBQXBDLEVBQTBELFNBQUE7aUJBQUcsbUJBQUEsQ0FBb0IsSUFBcEI7UUFBSCxDQUExRDtPQUFkO0FBRUEsYUFBTztJQTNESCxDQURSO0VBcENZOztFQWtHZCxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQXBHakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuL2dpdCdcblxuZ2V0Q29tbWFuZHMgPSAtPlxuICBHaXRCcmFuY2ggICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWJyYW5jaCdcbiAgR2l0RGVsZXRlTG9jYWxCcmFuY2ggICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1kZWxldGUtbG9jYWwtYnJhbmNoJ1xuICBHaXREZWxldGVSZW1vdGVCcmFuY2ggID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWRlbGV0ZS1yZW1vdGUtYnJhbmNoJ1xuICBHaXRDaGVja291dEFsbEZpbGVzICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWNoZWNrb3V0LWFsbC1maWxlcydcbiAgR2l0Q2hlY2tvdXRGaWxlICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1jaGVja291dC1maWxlJ1xuICBHaXRDaGVycnlQaWNrICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWNoZXJyeS1waWNrJ1xuICBHaXRDb21taXQgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWNvbW1pdCdcbiAgR2l0Q29tbWl0QW1lbmQgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1jb21taXQtYW1lbmQnXG4gIEdpdERpZmYgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtZGlmZidcbiAgR2l0RGlmZnRvb2wgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1kaWZmdG9vbCdcbiAgR2l0RGlmZkFsbCAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1kaWZmLWFsbCdcbiAgR2l0RmV0Y2ggICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1mZXRjaCdcbiAgR2l0RmV0Y2hQcnVuZSAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1mZXRjaC1wcnVuZSdcbiAgR2l0SW5pdCAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1pbml0J1xuICBHaXRMb2cgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWxvZydcbiAgR2l0UHVsbCAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1wdWxsJ1xuICBHaXRQdXNoICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXB1c2gnXG4gIEdpdFJlbW92ZSAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtcmVtb3ZlJ1xuICBHaXRTaG93ICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXNob3cnXG4gIEdpdFN0YWdlRmlsZXMgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3RhZ2UtZmlsZXMnXG4gIEdpdFN0YWdlRmlsZXNCZXRhICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3RhZ2UtZmlsZXMtYmV0YSdcbiAgR2l0U3RhZ2VIdW5rICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1zdGFnZS1odW5rJ1xuICBHaXRTdGFzaEFwcGx5ICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXN0YXNoLWFwcGx5J1xuICBHaXRTdGFzaERyb3AgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXN0YXNoLWRyb3AnXG4gIEdpdFN0YXNoUG9wICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3Rhc2gtcG9wJ1xuICBHaXRTdGFzaFNhdmUgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXN0YXNoLXNhdmUnXG4gIEdpdFN0YXNoU2F2ZU1lc3NhZ2UgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3Rhc2gtc2F2ZS1tZXNzYWdlJ1xuICBHaXRTdGF0dXMgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXN0YXR1cydcbiAgR2l0VGFncyAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC10YWdzJ1xuICBHaXRVbnN0YWdlRmlsZXMgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXVuc3RhZ2UtZmlsZXMnXG4gIEdpdFJ1biAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtcnVuJ1xuICBHaXRNZXJnZSAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LW1lcmdlJ1xuICBHaXRSZWJhc2UgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXJlYmFzZSdcbiAgR2l0T3BlbkNoYW5nZWRGaWxlcyAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1vcGVuLWNoYW5nZWQtZmlsZXMnXG5cbiAgZ2l0LmdldFJlcG8oKVxuICAgIC50aGVuIChyZXBvKSAtPlxuICAgICAgY3VycmVudEZpbGUgPSByZXBvLnJlbGF0aXZpemUoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKCkpXG4gICAgICBnaXQucmVmcmVzaCByZXBvXG4gICAgICBjb21tYW5kcyA9IFtdXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmV4cGVyaW1lbnRhbC5jdXN0b21Db21tYW5kcycpXG4gICAgICAgIGNvbW1hbmRzID0gY29tbWFuZHMuY29uY2F0KHJlcXVpcmUoJy4vc2VydmljZScpLmdldEN1c3RvbUNvbW1hbmRzKCkpXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6YWRkJywgJ0FkZCcsIC0+IGdpdC5hZGQocmVwbywgZmlsZTogY3VycmVudEZpbGUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmFkZC1tb2RpZmllZCcsICdBZGQgTW9kaWZpZWQnLCAtPiBnaXQuYWRkKHJlcG8sIHVwZGF0ZTogdHJ1ZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6YWRkLWFsbCcsICdBZGQgQWxsJywgLT4gZ2l0LmFkZChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpsb2cnLCAnTG9nJywgLT4gR2l0TG9nKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmxvZy1jdXJyZW50LWZpbGUnLCAnTG9nIEN1cnJlbnQgRmlsZScsIC0+IEdpdExvZyhyZXBvLCBvbmx5Q3VycmVudEZpbGU6IHRydWUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnJlbW92ZS1jdXJyZW50LWZpbGUnLCAnUmVtb3ZlIEN1cnJlbnQgRmlsZScsIC0+IEdpdFJlbW92ZShyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjaGVja291dC1hbGwtZmlsZXMnLCAnQ2hlY2tvdXQgQWxsIEZpbGVzJywgLT4gR2l0Q2hlY2tvdXRBbGxGaWxlcyhyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjaGVja291dC1jdXJyZW50LWZpbGUnLCAnQ2hlY2tvdXQgQ3VycmVudCBGaWxlJywgLT4gR2l0Q2hlY2tvdXRGaWxlKHJlcG8sIGZpbGU6IGN1cnJlbnRGaWxlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjb21taXQnLCAnQ29tbWl0JywgLT4gR2l0Q29tbWl0KHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmNvbW1pdC1hbGwnLCAnQ29tbWl0IEFsbCcsIC0+IEdpdENvbW1pdChyZXBvLCBzdGFnZUNoYW5nZXM6IHRydWUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmNvbW1pdC1hbWVuZCcsICdDb21taXQgQW1lbmQnLCAtPiBHaXRDb21taXRBbWVuZChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czphZGQtYW5kLWNvbW1pdCcsICdBZGQgQW5kIENvbW1pdCcsIC0+IGdpdC5hZGQocmVwbywgZmlsZTogY3VycmVudEZpbGUpLnRoZW4gLT4gR2l0Q29tbWl0KHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmFkZC1hbmQtY29tbWl0LWFuZC1wdXNoJywgJ0FkZCBBbmQgQ29tbWl0IEFuZCBQdXNoJywgLT4gZ2l0LmFkZChyZXBvLCBmaWxlOiBjdXJyZW50RmlsZSkudGhlbiAtPiBHaXRDb21taXQocmVwbywgYW5kUHVzaDogdHJ1ZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6YWRkLWFsbC1hbmQtY29tbWl0JywgJ0FkZCBBbGwgQW5kIENvbW1pdCcsIC0+IGdpdC5hZGQocmVwbykudGhlbiAtPiBHaXRDb21taXQocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6YWRkLWFsbC1jb21taXQtYW5kLXB1c2gnLCAnQWRkIEFsbCwgQ29tbWl0IEFuZCBQdXNoJywgLT4gZ2l0LmFkZChyZXBvKS50aGVuIC0+IEdpdENvbW1pdChyZXBvLCBhbmRQdXNoOiB0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjb21taXQtYWxsLWFuZC1wdXNoJywgJ0NvbW1pdCBBbGwgQW5kIFB1c2gnLCAtPiBHaXRDb21taXQocmVwbywgc3RhZ2VDaGFuZ2VzOiB0cnVlLCBhbmRQdXNoOiB0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjaGVja291dCcsICdDaGVja291dCcsIC0+IEdpdEJyYW5jaC5naXRCcmFuY2hlcyhyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjaGVja291dC1yZW1vdGUnLCAnQ2hlY2tvdXQgUmVtb3RlJywgLT4gR2l0QnJhbmNoLmdpdFJlbW90ZUJyYW5jaGVzKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOm5ldy1icmFuY2gnLCAnQ2hlY2tvdXQgTmV3IEJyYW5jaCcsIC0+IEdpdEJyYW5jaC5uZXdCcmFuY2gocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZGVsZXRlLWxvY2FsLWJyYW5jaCcsICdEZWxldGUgTG9jYWwgQnJhbmNoJywgLT4gR2l0RGVsZXRlTG9jYWxCcmFuY2gocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZGVsZXRlLXJlbW90ZS1icmFuY2gnLCAnRGVsZXRlIFJlbW90ZSBCcmFuY2gnLCAtPiBHaXREZWxldGVSZW1vdGVCcmFuY2gocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6Y2hlcnJ5LXBpY2snLCAnQ2hlcnJ5LVBpY2snLCAtPiBHaXRDaGVycnlQaWNrKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmRpZmYnLCAnRGlmZicsIC0+IEdpdERpZmYocmVwbywgZmlsZTogY3VycmVudEZpbGUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmRpZmZ0b29sJywgJ0RpZmZ0b29sJywgLT4gR2l0RGlmZnRvb2wocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZGlmZi1hbGwnLCAnRGlmZiBBbGwnLCAtPiBHaXREaWZmQWxsKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmZldGNoJywgJ0ZldGNoJywgLT4gR2l0RmV0Y2gocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZmV0Y2gtcHJ1bmUnLCAnRmV0Y2ggUHJ1bmUnLCAtPiBHaXRGZXRjaFBydW5lKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnB1bGwnLCAnUHVsbCcsIC0+IEdpdFB1bGwocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6cHVzaCcsICdQdXNoJywgLT4gR2l0UHVzaChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpwdXNoLXNldC11cHN0cmVhbScsICdQdXNoIC11JywgLT4gR2l0UHVzaChyZXBvLCBzZXRVcHN0cmVhbTogdHJ1ZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6cmVtb3ZlJywgJ1JlbW92ZScsIC0+IEdpdFJlbW92ZShyZXBvLCBzaG93U2VsZWN0b3I6IHRydWUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnJlc2V0JywgJ1Jlc2V0IEhFQUQnLCAtPiBnaXQucmVzZXQocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6c2hvdycsICdTaG93JywgLT4gR2l0U2hvdyhyZXBvKV1cbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZXhwZXJpbWVudGFsLnN0YWdlRmlsZXNCZXRhJylcbiAgICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnN0YWdlLWZpbGVzJywgJ1N0YWdlIEZpbGVzJywgLT4gR2l0U3RhZ2VGaWxlc0JldGEocmVwbyldXG4gICAgICBlbHNlXG4gICAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpzdGFnZS1maWxlcycsICdTdGFnZSBGaWxlcycsIC0+IEdpdFN0YWdlRmlsZXMocmVwbyldXG4gICAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czp1bnN0YWdlLWZpbGVzJywgJ1Vuc3RhZ2UgRmlsZXMnLCAtPiBHaXRVbnN0YWdlRmlsZXMocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6c3RhZ2UtaHVuaycsICdTdGFnZSBIdW5rJywgLT4gR2l0U3RhZ2VIdW5rKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnN0YXNoLXNhdmUnLCAnU3Rhc2g6IFNhdmUgQ2hhbmdlcycsIC0+IEdpdFN0YXNoU2F2ZShyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpzdGFzaC1zYXZlLW1lc3NhZ2UnLCAnU3Rhc2g6IFNhdmUgQ2hhbmdlcyBXaXRoIE1lc3NhZ2UnLCAtPiBHaXRTdGFzaFNhdmVNZXNzYWdlKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnN0YXNoLXBvcCcsICdTdGFzaDogQXBwbHkgKFBvcCknLCAtPiBHaXRTdGFzaFBvcChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpzdGFzaC1hcHBseScsICdTdGFzaDogQXBwbHkgKEtlZXApJywgLT4gR2l0U3Rhc2hBcHBseShyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpzdGFzaC1kZWxldGUnLCAnU3Rhc2g6IERlbGV0ZSAoRHJvcCknLCAtPiBHaXRTdGFzaERyb3AocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6c3RhdHVzJywgJ1N0YXR1cycsIC0+IEdpdFN0YXR1cyhyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czp0YWdzJywgJ1RhZ3MnLCAtPiBHaXRUYWdzKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnJ1bicsICdSdW4nLCAtPiBuZXcgR2l0UnVuKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOm1lcmdlJywgJ01lcmdlJywgLT4gR2l0TWVyZ2UocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6bWVyZ2UtcmVtb3RlJywgJ01lcmdlIFJlbW90ZScsIC0+IEdpdE1lcmdlKHJlcG8sIHJlbW90ZTogdHJ1ZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6bWVyZ2Utbm8tZmFzdC1mb3J3YXJkJywgJ01lcmdlIHdpdGhvdXQgZmFzdC1mb3J3YXJkJywgLT4gR2l0TWVyZ2UocmVwbywgbm9GYXN0Rm9yd2FyZDogdHJ1ZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6cmViYXNlJywgJ1JlYmFzZScsIC0+IEdpdFJlYmFzZShyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpnaXQtb3Blbi1jaGFuZ2VkLWZpbGVzJywgJ09wZW4gQ2hhbmdlZCBGaWxlcycsIC0+IEdpdE9wZW5DaGFuZ2VkRmlsZXMocmVwbyldXG5cbiAgICAgIHJldHVybiBjb21tYW5kc1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldENvbW1hbmRzXG4iXX0=
