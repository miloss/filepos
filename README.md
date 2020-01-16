# filepos

> Find text at line:column in remote files


## Installation
```
npm install -g filepos
```


## Usage
```
$ filepos
Usage: filepos <path> [options]

Options:
-c, --context         Length of surrounding context to fetch, default ${DEFAULT_CONTEXT} (chars)
```


### Example

```
$ filepos https://raw.githubusercontent.com/miloss/filepos/master/bin/filepos:12:42
```
