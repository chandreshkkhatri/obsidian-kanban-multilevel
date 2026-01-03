# Obsidian Kanban Multilevel Plugin

Create markdown-backed Kanban Multilevel boards in [Obsidian](https://obsidian.md/)

- [Bugs, Issues, & Feature Requests](https://github.com/mgmeyers/obsidian-kanban-multilevel/issues)
- [Development Roadmap](https://github.com/mgmeyers/obsidian-kanban-multilevel/projects/1)

![Screen Shot 2021-09-16 at 12.58.22 PM.png](https://github.com/mgmeyers/obsidian-kanban-multilevel/blob/main/docs/Assets/Screen%20Shot%202021-09-16%20at%2012.58.22%20PM.png)

![Screen Shot 2021-09-16 at 1.10.38 PM.png](https://github.com/mgmeyers/obsidian-kanban-multilevel/blob/main/docs/Assets/Screen%20Shot%202021-09-16%20at%201.10.38%20PM.png)

## Creating Lanes in Different Rows

You can organize your Kanban board into multiple horizontal rows, each containing its own set of lanes. To assign a lane to a specific row, use the following syntax in your markdown:

```
## Lane Title {row:Row Name}
```

- You can also combine this with a max items limit:
  ```
  ## Lane Title (5) {row:Row Name}
  ```
- The `{row:Row Name}` part at the end of the lane title will group that lane into a separate row called "Row Name" in the board UI.
- Lanes without a `{row:...}` will appear in the default row.

This feature allows you to visually organize your board into multiple horizontal sections (rows), each containing its own set of lanes.

## Documentation

Find the plugin documentation here: [Obsidian Kanban Multilevel Plugin Documentation](https://publish.obsidian.md/kanban-multilevel/)

## Support

If you find this plugin useful and would like to support its development, you can sponsor [me](https://github.com/mgmeyers) on Github, or buy me a coffee.

[![GitHub Sponsors](https://img.shields.io/github/sponsors/mgmeyers?label=Sponsor&logo=GitHub%20Sponsors&style=for-the-badge)](https://github.com/sponsors/mgmeyers)

<a href="https://www.buymeacoffee.com/mgme"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=mgme&button_colour=5F7FFF&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00"></a>
