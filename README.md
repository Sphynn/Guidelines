## Contributors

When starting to work on the project, make a [fork](https://help.github.com/articles/fork-a-repo/) from the Origin and have an always updated `master` copy. Before starting on a module, [branch off](https://help.github.com/articles/creating-and-deleting-branches-within-your-repository/) your local `master` and once complete, submit a pull-request.

## Terms

By accessing this web site, you are agreeing to be bound by these web site Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this web site are protected by applicable copyright and trade mark law.

## License

[Online](https://www.yourofficehub.com/assets/legal/TermsOfService.html)

1. Permission is granted to temporarily download one copy of the materials (information or software) on the yourofficehub.com web site for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
	* modify or copy the materials;
	* use the materials for any commercial purpose, or for any public display (commercial or non-commercial);
	* attempt to decompile or reverse engineer any software contained on the yourofficehub.com web site;
	* remove any copyright or other proprietary notations from the materials; or
	* transfer the materials to another person or "mirror" the materials on any other server.
2. This license shall automatically terminate if you violate any of these restrictions and may be terminated by yourofficehub.com at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.

## Disclaimer

The materials on the yourofficehub.com web site are provided "as is". yourofficehub.com makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, yourofficehub.com does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Internet web site or otherwise relating to such materials or on any sites linked to this site.

## GitHub Notes

To delete the current master branch, and recreate it using origin
----------------------
```git
git branch old_master
git checkout old_master
git push origin old_master
git checkout master
git reset --hard 4f2bf3170d498e3f54953d057f6b2ee293cb991e
git pull upstream master
```

Log in to github.com, change branch to old_master.

```git
git push origin :master
git push origin master
```

Log in to github.com, change branch to master.

To update master from origin
---------------------

Launch git shell

```git
git fetch upstream
git checkout master
git merge upstream/master
git checkout branch-name
git merge master
```


Go to branch directory

To update a branch after the master have been updated from origin

```git
git checkout branch-name
git merge master
```

If there are conflicts, simply right click the file (in GitHub for Windos) and select 'Discard file'.
