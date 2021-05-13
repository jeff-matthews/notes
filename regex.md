# Regex for docs

## Find `link` tags

Using VS Code

find

```text
(\{%\slink\s)([\/\w-]+[\.\d\/\w-]+)(.md)\s%\}
```

Swap `(.md)` with `(.png)` to find images.

replace

```text
{{ site.baseurl }}/$2.html
```

Swap `(.html)` with `(.png)` to replace images.
