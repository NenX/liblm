pub mod build;
pub mod commands;
pub mod fresh;
pub mod install;
// pub mod pick_color;
pub mod proxy_local;
pub mod serve_at;
pub mod start;

use build::do_build;
use clap::Parser;

use commands::{Cli, Commands, CommandsPlain};
use install::{do_install, InstallArgs, INSTALL_ARGS};
use lm_fe_rust::my_local_helper::update_github_host;
use proxy_local::proxy_local;
use serve_at::{serve_at, ServeAtArgs};
use start::do_start;

use crate::utils::DynErr;

pub async fn client_serve_cmds() -> DynErr<()> {
    let cli_res = Cli::try_parse();

    match cli_res {
        Ok(cli) => match &cli.command {
            Commands::FastGithub => update_github_host().await,
            Commands::Install(args) => do_install(args).await?,
            Commands::Build => do_build().await?,
            Commands::ServeAt(args) => serve_at(args).await,
            Commands::ProxyLocal(args) => proxy_local(args).await,
            Commands::Start => do_start().await?,
            // Commands::PickColor => pick_color::pick_color().unwrap(),
        },
        Err(e) => {
            // let _ = e.print();
            println!("欢迎使用 lm_fe 客户端工具🚀！");
            let mut prompter = inquire::Select::new("请选择操作：", CommandsPlain::to_vec());
            prompter.help_message = Some("提示：使用👆/👇箭头导航，输入文字过滤，按回车键选择。");
            let project = prompter.prompt();
            if let Ok(cmd) = project {
                match cmd {
                    CommandsPlain::Install => {
                        let install =
                            inquire::Select::new("选择安装包：", INSTALL_ARGS.to_vec()).prompt();
                        if let Ok(install) = install {
                            let name = if install == "all" {
                                None
                            } else {
                                Some(install.to_string())
                            };
                            let args = InstallArgs { name };
                            do_install(&args).await?;
                        }
                    }
                    CommandsPlain::Build => {
                        do_build().await?;
                    }
                    CommandsPlain::Start => do_start().await?,
                    CommandsPlain::FastGithub => {
                        update_github_host().await;
                    }
                    CommandsPlain::ServeAt => {
                        let args = ServeAtArgs {
                            dir: "dist".to_string(),
                            port: None,
                            proxy: None,
                        };
                        serve_at(&args).await;
                    }
                    CommandsPlain::ProxyLocal => {}
                    CommandsPlain::Help => e.print().expect("print error"),
                    // CommandsPlain::PickColor => pick_color::pick_color().unwrap(),
                }
            }
        }
    }
    println!();
    Ok(())
}
