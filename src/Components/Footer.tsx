import { Layout } from "antd";
import React from "react";

const { Footer } = Layout;

const AppFooter: React.FC  = () => {
  return (
    <Footer style={{ textAlign: "center", backgroundColor: "#001529", color: "white", padding: "30px 0", marginTop: "auto" }}>
      ᴅᴏᴍɪɴɪᴄᴀɴ ᴅᴇʟɪɢʜᴛꜱ ©{new Date().getFullYear()}
    </Footer>
  );
};

export default AppFooter;