import { Menu, MenuItemConstructorOptions } from "electron";

export function createMenu() {
  const submenu: MenuItemConstructorOptions[] = [
    {
      label: "关于",
      role: "about",
    },
    {
      label: "退出",
      role: "quit",
      accelerator: "CommandOrControl+Q",
    },
  ];
  if (import.meta.env.DEV) {
    submenu.push({
      label: "开发者工具",
      role: "toggleDevTools",
      accelerator: "CommandOrControl+Alt+I",
    });
  }

  const menu = Menu.buildFromTemplate([
    {
      label: "图小小",
      submenu,
    },
  ]);

  Menu.setApplicationMenu(menu);
}
