const { QApplication, ColorGroup, ColorRole } = require("@nodegui/nodegui");
const Registry = require("winreg");

const path = require("path");
const os = require("os");
const { promisify } = require("util");

const getAssetPath = (filename, isDark) =>
    path.join(__appPath, "assets", "gui", isDark ? "dark" : "light", filename);

const createTheme = (isDark) => {
    return {
        isDark,
        colors: {
            primary: "#ff7632",
            text: isDark ? "#e6d5cc" : "#5c463b",
            secondaryText: isDark ? "#c8a898" : "#826354",
            background: isDark ? "#1c0f08" : "#fbf4f0",
            secondaryBg: isDark ? "#28160d" : "#fff4ee",
            selected: isDark ? "#6d402a" : "#ffc6aa",
            button: {
                bg: isDark ? "#412619" : "#ffe8dd",
                hover: isDark ? "#4f2c1a" : "#f9ded1",
                pressed: isDark ? "#2f1c12" : "#ffdac8",
                border: isDark ? "#6d402a" : "#ffc6aa",
                text: isDark ? "#e6d5cc" : "#5c463b",
            },
            input: {
                bg: isDark ? "#2f1c12" : "#ffeee6",
                hover: isDark ? "#3d2a20" : "#ffede4",
                border: isDark ? "#6d402a" : "#ffc6aa",
                placeholder: isDark ? "#bb8e77" : "#b09588",
            },
            group: {
                bg: isDark ? "#2f1c12" : "#ffeee6",
                border: isDark ? "#412618" : "#f9ded1",
            },
            checkbox: {
                border: isDark ? "#996c55" : "#e6c9bb",
                hover: "#ff7632",
                bg: isDark ? "#33231b" : "#ffffff",
                checked: "#ff7632",
                disabledBg: isDark ? "#554740" : "#e8d9d2",
                disabledBorder: isDark ? "#8c6c5c" : "#d6b7a7",
            },
            scrollbar: {
                handle: isDark ? "#7a4b33" : "#ffd5c0",
                hover: "#ff9966",
            },
            danger: {
                main: '#a0285f',
                border: '#d63479',
                hover: '#e24b91',
                pressed: '#bb0055'
            },
            taskGroups: {
                running: {
                    main: isDark ? "#2f1c12" : "#ffeee6",
                    border: isDark ? "#412618" : "#f9ded1",
                },
                completed: {
                    main: isDark ? "#122f16" : "#ebffe6",
                    border: isDark ? "#18411e" : "#dbf9d1"
                },
                failed: {
                    main: isDark ? "#2f2912" : "#f9ffe6",
                    border: isDark ? "#413818" : "#f2f9d1"
                },
                cancelling: {
                    main: isDark ? "#2f1312" : "#ffe6e7",
                    border: isDark ? "#411918" : "#f9d1d5"
                },
                cancelled: {
                    main: isDark ? "#2f1312" : "#ffe6e7",
                    border: isDark ? "#411918" : "#f9d1d5"
                },
                killed: {
                    main: isDark ? "#930000" : "#ffacac",
                    border: isDark ? "#c90000" : "#ff5067"
                }
            },
            tweens: {
                linear: {
                    bg: '#929292',
                    border: '#606060'
                },
                constant: {
                    bg: '#9d50d4',
                    border: '#713a99'
                },
                sine: {
                    bg: '#2bd31f',
                    border: '#1e9215'
                },
                quad: {
                    bg: '#e41919',
                    border: '#9a1111'
                },
                cubic: {
                    bg: '#ddb439',
                    border: '#957927'
                },
                quart: {
                    bg: '#d68809',
                    border: '#996107'
                },
                quint: {
                    bg: '#e95aab',
                    border: '#9d3c73'
                },
                expo: {
                    bg: '#b62af2',
                    border: '#621682'
                },
                circ: {
                    bg: '#d40071',
                    border: '#9a0052'
                },
                back: {
                    bg: '#c3aee1',
                    border: '#7f7192'
                },
                elastic: {
                    bg: '#72a439',
                    border: '#4a6b25'
                },
                bounce: {
                    bg: '#99e4cf',
                    border: '#649587'
                }
            }
        },
        assets: {
            leftArrow: getAssetPath("left.svg", isDark),
            rightArrow: getAssetPath("right.svg", isDark),
            downArrow: getAssetPath("down.svg", isDark),
            upArrow: getAssetPath("up.svg", isDark),
            starIcon: getAssetPath("star.svg", isDark),
            starFilledIcon: path.join(__appPath, "assets", "gui", "star-filled.svg"),
            sidebarIcon: getAssetPath("sidebar.svg", isDark),
            sidebarFilledIcon: getAssetPath("sidebar-filled.svg", isDark),
            tasklistIcon: getAssetPath("tasklist.svg", isDark),
            tasklistFilledIcon: getAssetPath("tasklist-filled.svg", isDark),
            closeIcon: getAssetPath("close.svg", isDark),
            menuIcon: getAssetPath("menu.svg", isDark),
            videoIcon: getAssetPath("video.svg", isDark),
            audioIcon: getAssetPath("audio.svg", isDark),
            videoSpin: getAssetPath("video-spin.gif", isDark),
            checkmark: path.join(__appPath, "assets", "gui", "checkmark.svg"),
            transparentBackground: getAssetPath("transparent.png", isDark),
            statuses: {
                error: path.join(__appPath, "assets", "gui", "warn.svg"),
                success: path.join(__appPath, "assets", "gui", "success.svg")
            }
        },
        sizes: {
            borderRadius: "10px",
            smallBorderRadius: "5px",
            padding: "5px",
            largePadding: "10px",
        },
        fonts: {
            title: {
                size: "20px",
                weight: "600",
            },
            groupLabel: {
                size: "15px",
                weight: "600",
            },
            small: {
                size: "12px",
            }
        }
    };
};

module.exports = {
    light: createTheme(false),
    dark: createTheme(true),
    createTheme,
    detectTheme: async () => {
        if (app.vars.theme == "light") return false;
        if (app.vars.theme == "dark") return true;

        if (os.platform() == "win32") {
            const regKey = new Registry({
                hive: Registry.HKCU,
                key: "\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize"
            });

            const getKey = promisify(regKey.get);
            const item = await getKey.call(regKey, "AppsUseLightTheme");

            return parseInt(item.value) === 0;
        }

        const appPalette = QApplication.instance().palette();
        const windowTextColor = appPalette.color(ColorGroup.Active, ColorRole.WindowText);
        return windowTextColor.red() > 128 &&
            windowTextColor.green() > 128 &&
            windowTextColor.blue() > 128;
    }
};