# filepos

> Find content at line:column in remote files


## Installation
```
npm install -g filepos
```


## Usage
```
$ filepos
Usage: filepos <path> [options]

Options:
-c, --context         Length of surrounding context to fetch, default 100 characters
```


### Example

```
$ filepos https://raw.githubusercontent.com/miloss/filepos/master/bin/filepos:12:42
```
