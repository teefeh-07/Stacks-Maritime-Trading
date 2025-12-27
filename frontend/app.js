import { AppConfig, UserSession, showConnect } from "@stacks/connect";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

function connectWallet() {
  showConnect({ appDetails: { name: "Maritime Trading", icon: window.location.origin + "/icon.png" }, onFinish: () => window.location.reload(), userSession });
}
