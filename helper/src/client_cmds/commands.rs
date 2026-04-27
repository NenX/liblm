use std::fmt::Display;

use clap::{Parser, Subcommand};

use super::{install::InstallArgs, proxy_local::ProxyLocalArgs, serve_at::ServeAtArgs};

#[derive(Parser)]
#[command(version, about, long_about = None)]
#[command(propagate_version = true)]
pub struct Cli {
    #[command(subcommand)]
    pub command: Commands,
}

#[derive(Subcommand, Clone)]
pub enum Commands {
    // /// 构建远程单个 lm_fe 依赖并安装到本地，用法: fresh pages-mchc
    // Fresh,
    /// 安装 lm_fe 依赖安装到本地，可指定单一依赖
    Install(InstallArgs),
    /// 打包本地项目并压缩
    Build,
    Start,
    // /// 取颜色
    // PickColor,
    /// 更新本地 GitHub Host，加快访问速度
    FastGithub,
    /// 监听静态资源(并代理)，例如 serve-at dist -p http://192.168.124.53:3351/api
    ServeAt(ServeAtArgs),
    /// 代理本地某个端口
    ProxyLocal(ProxyLocalArgs),
}

#[derive(Clone,Debug)]
pub enum CommandsPlain {
    Install,
    Build,
    Start,
    FastGithub,
    ServeAt,
    ProxyLocal,
    Help,
    // PickColor
}
impl CommandsPlain {
    pub fn to_vec() -> Vec<Self> {
        vec![
            CommandsPlain::Start,
            CommandsPlain::Build,
            CommandsPlain::Install,
            CommandsPlain::FastGithub,
            CommandsPlain::ServeAt,
            CommandsPlain::ProxyLocal,
            CommandsPlain::Help,
            // CommandsPlain::PickColor,
        ]
    }
}
impl Display for CommandsPlain {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            CommandsPlain::Install => write!(f, "install(安装依赖)"),
            CommandsPlain::Build => write!(f, "build(构建项目)"),
            CommandsPlain::Start => write!(f, "start(运行项目)"),
            CommandsPlain::FastGithub => write!(f, "fastgithub(更新) GitHub Host"),
            CommandsPlain::ServeAt => write!(f, "serveat(监听静态资源)"),
            CommandsPlain::ProxyLocal => write!(f, "proxylocal(代理本地端口)"),
            CommandsPlain::Help => write!(f, "help(帮助)"),
            // CommandsPlain::PickColor =>  write!(f, "pickcolor(取颜色)"),
        }
    }
}