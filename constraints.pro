% Enforce all packages are MIT licensed.
gen_enforced_field(WorkspaceCwd, 'license', 'MIT').

gen_enforced_field(WorkspaceCwd, 'name', WorkspaceName) :-
  sub_atom(WorkspaceCwd, 9, Len, After, PackageName),
  atom_concat('@formulaic/', PackageName, WorkspaceName),
  atom_concat('packages/', PackageName, WorkspaceCwd).

% Enforce all packages set the correct repository
gen_enforced_field(WorkspaceCwd, 'repository.type', 'git').
gen_enforced_field(WorkspaceCwd, 'repository.url', 'https://github.com/codelenny/formulaic.git').
gen_enforced_field(WorkspaceCwd, 'repository.directory', WorkspaceCwd) :-
  \+ WorkspaceCwd = '.'.

% Enforce all packages have an author
gen_enforced_field(WorkspaceCwd, 'author.name', 'Flyyn').

% enforce that all packages must depend on typescript,
% and enforce a consistent version.
gen_enforced_dependency(WorkspaceCwd, 'typescript', '^4.7.4', 'devDependencies').

% 'typescript' may only be a dev dependency,
% and may not exist under any other dependency section.
gen_enforced_dependency(WorkspaceCwd, 'typescript', null, DependencyType) :-
  workspace_has_dependency(WorkspaceCwd, 'typescript', _, DependencyType),
  \+ DependencyType = 'devDependencies'.

% Packages must have a 'prepack' script, that's the same as the build script
% (ignored if package does not have a 'build' script)
gen_enforced_field(WorkspaceCwd, 'scripts.prepack', BuildScript) :-
  % must match build script (which must exist)
  workspace_field(WorkspaceCwd, 'scripts.build', BuildScript),
  % ignore examples
  \+ atom_concat('example/', _, WorkspaceCwd).

% Packages must have a 'prepublishOnly' script, that's the same as the build script
% (ignored if package does not have a 'build' script)
gen_enforced_field(WorkspaceCwd, 'scripts.prepublishOnly', BuildScript) :-
  % must match build script (which must exist)
  workspace_field(WorkspaceCwd, 'scripts.build', BuildScript),
  % ignore examples
  \+ atom_concat('example/', _, WorkspaceCwd).

% Examples must be private.
gen_enforced_field(WorkspaceCwd, 'private', true) :-
  atom_concat('example/', _, WorkspaceCwd).

% Packages must be public.
gen_enforced_field(WorkspaceCwd, 'private', null) :-
  atom_concat('packages/', _, WorkspaceCwd).
